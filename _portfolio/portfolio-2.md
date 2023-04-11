---
title: "Personalized Steam Video Game Recommender"
excerpt: "<img src='/images/steam_banner_2.jpg' width='500' height='300'>"
collection: portfolio
---

<br>
<img src='../../../../images/steam_banner_2.jpg'>

## Table of Contents
- [Introduction](#introduction)
    - [Dataset Source and Definitions](#dataset-source-and-definitions)
- [Data Processing](#data-processing)
    - [Dataset Normalization](#dataset-normalization)
    - [Data Imputation](#data-imputation)
    - [Data Cleaning](#data-cleaning)
- [Exploratory Data Analysis](#eda)
- [Model Building](#model-building)
    - [Interaction Matrices](#interaction-matrices)
    - [Considered Models](#considered-models)
    - [Model Tuning](#model-tuning)
    - [Final Model](#final-model)
- [Recommendation Dashboard](#recommendatio-dashboard)
- [Future Work](#future-work)


## Introduction
[Steam](https://store.steampowered.com/) is a video game digitial distribution service and storefront developed by Valve Corportation in 2003. The platform, available on Windows, macOS, and Linux, also includes services including: automatic game updates, cloud storage for game progress, and community features such as direct messaging, in-game chats and a community market, making it the defacto default way to purchase and play PC games. Appropriately, the service is the largest digital distribution platform for PC gaming, estimated around 75% of the market share in 2013 according to [IHS Screen Digest](https://www.bloomberg.com/news/articles/2013-11-04/valve-lines-up-console-partners-in-challenge-to-microsoft-sony#xj4y7vzkg). It's massive user base and reach across the PC gaming market makes it an excellent source of data on user behavior and video game engagement.

Our goal in this project is to build a robust recommender system on Steam data, to accurately predict video games that users are likely to buy and understand patterns in user behavior. 

### Dataset Source and Definitions:
Data for this project was acquired from UCSD Professor Julian McAuley's graduate research lab. [website](https://cseweb.ucsd.edu/~jmcauley/datasets.html#steam_data) The data was originally scraped from Australian Steam community data in 2017 by Julian McAuley and graduate assitants for their paper: [Generating and personalizing bundle recommendations on Steam](https://cseweb.ucsd.edu/~jmcauley/pdfs/sigir17.pdf) This dataset contains a comprehensive collection of data from the Australian Steam community, including detailed information on users' owned games, video game metadata, and user reviews. The dataset contains information on 2,567,538 users and 15,474 games, making up over 10 million user-game interaction pairings.

The original data is seperated into three datasets, respectively, containing information on users' owned games, video game metadata, and user reviews. For our purposes, we will only use data on users' owned games and games and game metadata. We will use the full set of columns from the users' owned games dataset and take a subset of columns from the game metadata dataset, ignoring information such as discount prices, sentiment, and development status. Below are the definitions of the columns we will use from these datasets.

Games Metadata (steam_games):

| **Column Name**     | **Definition**                                               |
| ------------------- | ------------------------------------------------------------ |
| `developer`         | developer name                                               |
| `app_name`          | name of the game                                             |
| `url`               | link to the game's steam store page                          |
| `release_date`      | release date of the game                                     |
| `price`             | retail price of the game, not including potential sales      |
| `item_id`           | internal identifier for the game                             |
| `genres`            | list of developer assigned genres (e.g., action)             |
| `tags`              | list of user assigned tags                                   |
| `specs`             | list of game specificiations (e.g., ultrawide support)       |

User Game Catalog Data (user_items):

| **Column Name**     | **Definition**                                                                   |
| ------------------- | -------------------------------------------------------------------------------- |
| `user_id`           | user's display name                                                              |
| `steam_id`          | user's internal unique indentifier (may be same as user_id)                      |
| `user_url`          | link to user's steam profile page                                                |
| `item_counts`       | total number of games owned by user                                              |
| `item_id`           | internal identifier for the game                                                 |
| `item_name`         | name of the game (app_name)                                                      |
| `playtime_forever`  | user's total playtime of the game                                                |
| `playtime_2weeks`   | user's playtime of the game within the past 2 weeks (at time of data collection) |