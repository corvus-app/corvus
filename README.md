# corvus
<p align="center">
  <img src="https://img.shields.io/badge/next%20js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/-MongoDB-13aa52?style=for-the-badge&logo=mongodb&logoColor=white" />
</p>

## Introduction
Have you ever been asked a "trivial" question by an intern? You're working on some huge features but you keep getting bothered by your juniors. You think to yourself, "Why can't they just do a few google searches and look around the codebase for their answers?".

**corvus** is a tool designed to address this issue.

It is intended to accelerate the onboarding process and improve productivity of juniors.

**NOTE: This is a demo for Confluent's AI Day challenge and does not reflect the final product.**

## Motivation
I had the opportunity to experience working with less-experienced developers as the main contributor on a few projects in high school. As I was developing the core features of the project, I had to answer the questions of my juniors who did not understand how to navigate the codebase or google their questions. I assumed that many of their questions were trivial and could easily be answered within a couple of minutes of searching. I thought to myself, "How could I use AI to transfer domain knowledge to my juniors so I don't have to answer these questions and I can focus on developing the core features?". 

I heard about how there were in-house co-pilot tools made by senior software developers that generated quality code (because it was based off of existing code made by the seniors) but there aren't any tools to help transfer their domain knowledge to juniors. And so now I'm here. 
## A Peek Inside
**corvus** uses AI to mimic how someone reasons through a ticket and outputs its findings to the user. It works by identifying relevant internal information to the user's query and also searches for note-worthy external posts, blogs, and documentation if needed.

**corvus** is **NOT** a co-pilot. It is a productivity tool. It will not generate new code for you and is grounded by the existing documentation and codebase. 

Confluent is used mainly for its real-time data streaming capabilities so there are connectors to GitHub and MongoDB to retrieve commits in real-time and push said commits to a sink. I tried using Apache Flink statements to convert the commits to embeddings in real-time as well but I had a lot of trouble trying so I scrapped that idea in favor of using MongoDB triggers. 

**corvus** is built on a multi-step RAG pipeline to ensure accuracy and relevancy. It uses ideas from the following papers:
- [Corrective Retrieval Augmented Generation](https://arxiv.org/pdf/2401.15884)
- [Self-RAG: Learning to Retrieve, Generate, and Critique Through Self-reflection](https://arxiv.org/pdf/2310.11511)
- [Adaptive-RAG: Learning to Adapt Retrieval-Augmented Large Language Models through Question Complexity](https://arxiv.org/pdf/2403.14403)
- [Can we further elicit reasoning in LLMs? Critic-guided Planning with Retrieval Augmentation for Solving Challenging Tasks](https://arxiv.org/pdf/2410.01428)

![alt text](ragpipeline.png?raw=true)

## What's Ahead
As a college freshman, I have not had the opportunity to work in industry and personally experience how a large codebase functions. I only had experience working on building internal administrative tools from the ground up at my high school. I would like to make integrations with multiple DevOps tools like Jira and Confluence. I've only heard of these tools from passing and personal experience with these tools would help me better understand how to improve this project further to work with larger codebases.

Because I only had around 5 days to work on this, I was unable to improve the RAG pipeline to my standards. The reasoning capabilities of the pipeline right now are subpar and need a lot of testing to be done to improve it. Given more time, I would make the LLM break down the question further and supplement the question with more relevant search queries and documents.

Goals:
- Integration with Jira, Confluence, and other sources to improve accuracy and relevancy.
- Perfecting the RAG pipeline to improve AI reasoning abilities.
- Implementing more agents and agent frameworks from academia.
- Testing to see how the AI performs under larger codebases and more sources.

