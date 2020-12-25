# AquilaDB
**AquilaDB** (*incubated by [a_മ്മ](https://github.com/a-mma)*) is a Decentralized Vector Database to store **Feature Vectors** along with **JSON Document Metadata**. Do **k-NN** retrieval from anywhere, even from the darkest rifts of Aquila (in progress). It is dead simple to set up, language agnostic and drop in addition for your Machine Learning Applications. AquilaDB, as of current features is ready solution for Machine Learning engineers and Data scientists to build **[Neural Information Retrieval](https://www.microsoft.com/en-us/research/uploads/prod/2017/06/INR-061-Mitra-neuralir-intro.pdf)** applications out of the box with minimal dependencies (visit [wiki page](https://github.com/a-mma/AquilaDB/wiki) for use case examples).



[Github](https://github.com/a-mma/AquilaDB)

Do you like this project? We love getting a **star** ⭐ and **shout-out** 🗣️ from you in return! 🤗

[Community support: ![discord chatroom for discussions](https://www.freeiconspng.com/minicovers/flat-discord-material-like-icon--2.png)](https://discord.gg/5YP7zHS)


# Who is this for

* If you are working on a data science project and need to store a hell lot of data and retrieve similar data based on some feature vector, this will be a useful tool to you, with extra benefits a real world web application needs.
* Are you dealing with a lot of images and related metadata? Want to find the similar ones? You are at the right place.
* If you are looking for a document database, this is not the right place for you.

# Technology
AquilaDB is not built from scratch. Thanks to OSS community, it is based on a couple of cool open source projects out there. We took a couch and added some wheels and jetpacks to make it a super cool butt rest for Data Scientists and ML Engineers. While **CouchDB** provides us network and scalability benefits, **FAISS** and **Annoy** provides superfast similarity search. Along with our peer management service, AquilaDB provides a unique solution.

# Install
### Debian

Run `curl -s -L https://raw.githubusercontent.com/Aquila-Network/AquilaDB/master/install.sh | /bin/bash`.

### Docker

**You need docker installed in your system**

Build image (one time process): `docker build https://raw.githubusercontent.com/Aquila-Network/AquilaDB/master/Dockerfile -t aquiladb:local`

Run image (to deploy aquilaDB): `docker run -p 5000:5000 -d aquiladb:local`

# Client SDKs
We currently have multiple client libraries in progress to abstract the communication between deployed AquilaDB and your applications.

[Python](https://github.com/Aquila-Network/AquilaPy)

# Progress
This project is still under active development (pre-release). It can be used as a standalone database now. Peer manager is a work in progress, so networking capabilities are not available now. With release v1.0 we will release pre-optimized version of AquilaDB.

# Contribute
We have [prepared a document](https://docs.google.com/document/d/1bT2_9FQIxQpx_rdYbkTukn_DJRi_haVK_ixTf8uTaDE/edit?usp=sharing) to get anyone interested to contribute, immediately started with AquilaDB.

Here is our high level [release roadmap](https://user-images.githubusercontent.com/19545678/62313851-5af82880-b4af-11e9-84f6-21e24bf46e8a.png).

# Learn

We have started meeting developers and do small talks on AquilaDB. Here are the slides that we use on those occasions: http://bit.ly/AquilaDB-slides 

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
<p align="center"><b>LOVE</b></p>
<br/>

> to sponsor this project contact@aquiladb.xyz

<br/><br/>

# Citing AquilaDB
If you use AquilaDB in an academic paper, we would 😍 to be cited. Here are the two ways of citing AquilaDB:
```
\footnote{https://github.com/a-mma/AquilaDB}
```
```
@misc{a_മ്മ2019AquilaDB,
  title={AquilaDB: Neural Information Retrieval Solution},
  author={Jubin Jose},
  howpublished={\url{https://github.com/a-mma/AquilaDB}},
  year={2019}
}
```

# License

Apache License 2.0 [license file](https://github.com/a-mma/AquilaDB/blob/master/LICENSE)

created with ❤️ a-mma.indic (a_മ്മ)
