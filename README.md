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

## A Peek Inside
**corvus** uses AI to mimic how someone reasons through a ticket and outputs its findings to the user. It works by identifying relevant internal information to the user's query and also searches for note-worthy external posts, blogs, and documentation if needed.

**corvus** is **NOT** a co-pilot. It is a productivity tool. It will not generate new code for you and is grounded by the existing documentation and codebase. This is an intended design.

**corvus** is built on a multi-step RAG pipeline to ensure accuracy and relevancy. It uses ideas from the following papers:
- [Corrective Retrieval Augmented Generation](https://arxiv.org/pdf/2401.15884)
- [Self-RAG: Learning to Retrieve, Generate, and Critique Through Self-reflection](https://arxiv.org/pdf/2310.11511)
- [Adaptive-RAG: Learning to Adapt Retrieval-Augmented Large Language Models through Question Complexity](https://arxiv.org/pdf/2403.14403)
- [Can we further elicit reasoning in LLMs? Critic-guided Planning with Retrieval Augmentation for Solving Challenging Tasks](https://arxiv.org/pdf/2410.01428)

![alt text](ragpipeline.png?raw=true)

## What's Ahead
- Integration with Jira, Confluence, and other sources to improve accuracy and relevancy.
- Perfecting the RAG pipeline to improve AI reasoning abilities.
- Implementing more agents and agent frameworks from academia.
- Testing to see how the AI performs under larger codebases and more sources.
