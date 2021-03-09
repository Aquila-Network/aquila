# Aquila DB
**[Aquila DB](https://github.com/Aquila-Network/AquilaDB)** is a Neural search engine. In other words, it is a database to index **Latent Vectors** generated by ML models along with **JSON Metadata** to perform **k-NN** retrieval. It is dead simple to set up, language-agnostic, and drop in addition to your Machine Learning Applications. Aquila DB, as of current features is a ready solution for Machine Learning engineers and Data scientists to build **[Neural Information Retrieval](https://www.microsoft.com/en-us/research/uploads/prod/2017/06/INR-061-Mitra-neuralir-intro.pdf)** applications out of the box with minimal dependencies.



Do you like this project? We love getting a **star** ⭐ and **shout-out** 🗣️ from you in return! 🤗

Join [Community chat and get support: ![discord chatroom for discussions](https://www.freeiconspng.com/minicovers/flat-discord-material-like-icon--2.png)](https://discord.gg/5YP7zHS)


# Who is this for

* If you are working on a data science project and need to store a hell of a lot of data and retrieve similar data based on some feature vector, this will be a useful tool to you, with extra benefits a real world web application needs.
* Are you dealing with a lot of images and related metadata? Want to find similar ones? You are at the right place.
* If you are looking for a document database, this is not the right place for you.

# Technology
Aquila DB is not built from scratch. Thanks to the OSS community, it is based on a couple of cool open source projects out there. We took a couch and added some wheels and jetpacks to make it a super cool butt rest for Data Scientists and ML Engineers. While **Couch DB** provides us network and scalability benefits, **FAISS** and **Annoy** provides superfast similarity search. Along with our peer management service, Aquila DB provides a unique solution.



If you are serious and wanna dive down the rabbit hole, read our **[whitepapers](https://github.com/Aquila-Network/whitepaper)** and **[technical specifications](https://github.com/Aquila-Network/specs)** (being actively worked on). 



**As a side note**, everything in **[Aquila Network](https://github.com/Aquila-Network)** is defined by the specifications and a large chunk of our efforts goes into it. We also maintain quality implementations of those specifications with non-technical users in mind. This is to make sure that - Aquila Network is fully open, decentralized by design, and Fair. You can follow those specifications to implement your alternative software and still interact with the network without any restrictions.

# Install
### Debian

Run `curl -s -L https://raw.githubusercontent.com/Aquila-Network/AquilaDB/master/install.sh | /bin/bash -s -- -d 1 `.

### Docker

**You need docker installed in your system**

Build image (lite): `docker build https://raw.githubusercontent.com/Aquila-Network/AquilaDB/master/Dockerfile -t aquiladb:local`

Build image (big data): `docker build https://raw.githubusercontent.com/Aquila-Network/AquilaDB/master/DockerfileBig -t aquiladb:localbg`

Run image (to deploy Aquila DB lite): `docker run -p 5001:5001 -d aquiladb:local`

Run image (to deploy Aquila DB big): `docker run -p 5001:5001 -d aquiladb:localbg`

# Client SDKs
We currently have multiple client libraries in progress to abstract the communication between deployed Aquila DB and your applications.

[Python](https://github.com/Aquila-Network/AquilaPy)

# Progress
This project is still and will be under active development with intermediate production releases. It can either be used as a standalone database or as a participating node in Aquila Network. Please note, [Aquila Port](https://github.com/Aquila-Network/specs/blob/main/README.md#aquila-port) (peer-peer network layer for Aquila DB nodes) is also a work in progress. Currently, you need to deploy your custom models to feed vector embeddings to Aquila DB, until [Aquila Hub](https://github.com/Aquila-Network/specs/blob/main/README.md#aquila-hub) developments get started.

# Contribute
We have [prepared a document](https://docs.google.com/document/d/1bT2_9FQIxQpx_rdYbkTukn_DJRi_haVK_ixTf8uTaDE/edit?usp=sharing) to get anyone interested to contribute, immediately started with Aquila DB.
Here is our high-level [release roadmap](https://user-images.githubusercontent.com/19545678/62313851-5af82880-b4af-11e9-84f6-21e24bf46e8a.png).

# Learn

We have started meeting developers and do small talks on Aquila DB. Here are the slides that we use on those occasions: http://bit.ly/AquilaDB-slides 

**Video:**

[<img alt="introduction to Neural Information retrieval with AquilaDB" src="http://img.youtube.com/vi/-VYpjpLXU5Q/0.jpg" width="300" />](http://www.youtube.com/watch?v=-VYpjpLXU5Q)

As of current AquilaDB release features, you can build **[Neural Information Retrieval](https://www.microsoft.com/en-us/research/uploads/prod/2017/06/INR-061-Mitra-neuralir-intro.pdf)** applications out of the box without any external dependencies. Here are some useful links to learn more about it and start building:

* These use case examples will give you an understanding of what is possible and what not: https://github.com/a-mma/AquilaDB/wiki
* Microsoft published a paper and youtube video on this to onboard anyone interested: 
  * paper: https://www.microsoft.com/en-us/research/uploads/prod/2017/06/INR-061-Mitra-neuralir-intro.pdf
  * video: https://www.youtube.com/watch?v=g1Pgo5yTIKg
* Embeddings for Everything: Search in the Neural Network Era: https://www.youtube.com/watch?v=JGHVJXP9NHw
* Autoencoders are one such deep learning algorithms that will help you to build semantic vectors - foundation for Neural Information retrieval. Here are some links to Autoencoders based IR:
  * go to chapter 15 in this link: https://www.cs.toronto.edu/~hinton/coursera_lectures.html
  * https://www.coursera.org/lecture/ml-foundations/examples-of-document-retrieval-in-action-CW25H
  * https://www.coursera.org/lecture/intro-to-deep-learning/autoencoders-101-QqBOa
* Note that, the idea of information retrieval applies not only to text data but for any data. All you need to do is, encode any source datatype to a dense vector with deep neural networks.

<br/><br/>
<h1 align="center">Our Sponsors</h1>
<p align="center"><b></b></p>

<br/>

> email us to sponsor this project [adbadmin@protonmail.ch](mailto:adbadmin@protonmail.ch).

<br/><br/>

# Citing Aquila DB
If you use Aquila DB in an academic paper, we would 😍 to be cited. Here are the two ways of citing Aquila DB:
```
\footnote{https://github.com/Aquila-Network/AquilaDB}
```
```
@misc{AquilaNetwork2019AquilaDB,
  title={AquilaDB: Neural Search Engine},
  author={Jubin Jose, Nibin Peter},
  howpublished={\url{https://github.com/Aquila-Network/AquilaDB}},
  year={2019}
}
```

# License

Apache License 2.0 [license file](https://github.com/Aquila-Network/AquilaDB/blob/master/LICENSE)

created by ❤️ with a-mma (a_മ്മ)
