import { Job } from "bullmq";
import Parser from "@postlight/parser";
import axios from 'axios';
import Container from "typedi";
import { DataSource } from "typeorm";

import db from '../config/db';
import { AppJobData, AppJobNames, IndexDocumentData } from "./types";
import { AquilaClientService } from "../lib/AquilaClientService";
import { AccountStatus } from "../service/dto/AuthServiceDto";
import { CollectionTemp } from "../entity/CollectionTemp";
import { Collection } from "../entity/Collection";
import { Bookmark, BookmarkStatus } from "../entity/Bookmark";
import { BookmarkPara } from "../entity/BookmarkPara";
import { BookmarkParaTemp } from "../entity/BookmarkParaTemp";
import { BookmarkTemp, BookmarkTempStatus } from "../entity/BookmarkTemp";
import { ConfigService } from "../lib/ConfigService";


async function summarize(html: string) {
	const configService = Container.get(ConfigService);
	const response = await axios.post(configService.get("SUMMARIZER_URL"), { html });	
	return response.data.result;
}

let dataSource: DataSource;

export default async function(job: Job<AppJobData, void, AppJobNames>) {
	if(job.name === AppJobNames.INDEX_DOCUMENT) {
			const { data  } = <{data: IndexDocumentData}>job;

			// load database
			if(!dataSource) {
				dataSource = await db.initialize();
			}

			// load bookmark
			let bookmarkObj: Bookmark | BookmarkTemp | null; 
			if(data.accountStatus === AccountStatus.TEMPORARY) {
				bookmarkObj = await BookmarkTemp.findOne({ where: {id: data.bookmarkId}});
			}else {
				bookmarkObj = await Bookmark.findOne({ where: {id : data.bookmarkId}});
			}
			if(bookmarkObj) {
				const bookmark: Bookmark | BookmarkTemp = bookmarkObj;
				// extract metadata from html
				const parsedHtml = await Parser.parse(bookmark.url, { html: bookmark.html});
				// generate array summary from text content
				const summary = await summarize(parsedHtml.content || "");
				if(bookmark.title) {
					summary.push(bookmark.title);
				}
				if(bookmark.summary) {
					summary.push(bookmark.summary);
				}

				// connect to aquila
				const aquilaClient = Container.get(AquilaClientService)
				await aquilaClient.connect();

				// load collection
				let collection: Collection | CollectionTemp | null;
				if(data.accountStatus === AccountStatus.TEMPORARY) {
					collection = await CollectionTemp.findOne({ where: { id: bookmark.collectionId }});
				}else {
					collection = await Collection.findOne({ where: { id: bookmark.collectionId }});
				}
				if(collection === null) {
					throw new Error('Collection not found');
				}
				// generate vector from array of paragraph 
				const vectorArray = await aquilaClient.getHubServer().compressDocument(collection.aquilaDbName, summary);
				// bulk insert into aquiladb

				let bookmarkParas: BookmarkPara[] | BookmarkParaTemp[];
				await db.transaction(async transactionalEntityManager => {
					// insert all para to bookmark_para table
					if(data.accountStatus === AccountStatus.TEMPORARY) {
						bookmarkParas = summary.map((para: string) => {
							const bookmarkPara = new BookmarkParaTemp()
							bookmarkPara.bookmarkId = bookmark.id,
							bookmarkPara.content = para;
							return bookmarkPara;
						})
						await transactionalEntityManager.save(bookmarkParas);
					}else {
							bookmarkParas = summary.map((para: string) => {
							const bookmarkPara = new BookmarkPara()
							bookmarkPara.bookmarkId = bookmark.id,
							bookmarkPara.content = para;
							return bookmarkPara;
						})
						await transactionalEntityManager.save(bookmarkParas);
					}
					// create documents on aquiladb
					const documents = summary.map((para: string, index: number) => {
						return {
							metadata: {
								para,
								bookmark_para_id: bookmarkParas[index].id,
								bookmark_id: bookmark.id
							},
							code: vectorArray[index]
						}
					})
					await aquilaClient.getDbServer().createDocuments((collection as Collection | CollectionTemp).aquilaDbName, documents)

					// update status as PROCESSED
					if(data.accountStatus === AccountStatus.TEMPORARY) {
						bookmark.status = BookmarkTempStatus.PROCESSED;
					}else {
						bookmark.status = BookmarkStatus.PROCESSED;
					}

					await transactionalEntityManager.save(bookmark);
				});
			}
	}
}