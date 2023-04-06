---
title: "League of Legends Champions Analysis Dashboard"
excerpt: "<img src='/images/league_banner.jpg' width='500' height='300'>"
collection: portfolio
---

<script type="text/javascript" src="../../../../scripts/app.js"></script>  
<script src="https://d3js.org/d3.v7.min.js"></script>
<script src="https://d3js.org/topojson.v1.min.js"></script>
<script src="https://d3js.org/d3-selection-multi.v1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3-legend/2.25.6/d3-legend.min.js"></script>
<script src="//code.jquery.com/jquery.js"></script>

<meta http-equiv="Permissions-Policy" content="interest-cohort=()">

<style>

.submit_button {
    <!-- display: inline-block; -->
    width: 100%;
    padding: 0.25em;
    margin-bottom: 0.5em;
    color: #494e52;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 1px 1px rgba(0,0,0,0.125);
}

div.tooltip{
    position: absolute;
    text-align: left;
    width: "fit-content";
    height: "fit-content";
    padding: 5px;
    background: white;
    pointer-events: none;
    }

</style>

<br>
<img src='../../../../images/league_banner.jpg'>

<h3>Introduction</h3>
<p>
    League of Legends is a popular MOBA (multiplayer online battle arena) video game published by Riot Games in 2009. In the game, two teams of 5 players each engage in PVP (player-versus-player) combat,with each team occupying and defending their half of the map. Each of the ten players controls a character, known as a "champion", with unique abilities and differing styles of play. In League's main mode, Summoner's Rift, a team wins by pushing through to the enemy base and destroying their "Nexus", a large structure located within.
    <br><br>
    Through this interactive dashboard we will run through the process of discovering a new champion for you to learn, whether you're new to the game or an experienced veteran. 
    <br><br>
    The dashboard is built upon Oracle Elixir’s 2022 League of Legends pro play esports dataset, which contains detailed information on tournament games played in League of Legends’ Season 12 (2022), by a variety of different professional players from all parts of the world.
    <br><br>
    The General Process Will Go:
    <br>
    Choosing a Role -> Choosing a Champion -> Choosing a Pro Player to Learn From
</p>

<div id="q1">
    <h3>Choose a Role:</h3>

    <p>
        In the game, each team is broken into 5 different roles, the top laner, jungler, mid laner, adc (bot), and a support, corresponding to each of the 5 players. Each of the 5 roles are responsible for different tasks and have different playstyles. 
        <br><br>
        To choose a role, we will explore two facets of the dataset, how win rates and damage types are distributed across the different roles.
        <br><br>
        To begin with, we will take a look at which roles in general, have the highest win rate (empirical chance of winning), as it can give us a good look into which roles are the most impactful to winning a game of League of Legends. To do so, we have visualized a boxplot displaying the distribution of win rates of different champions, grouped by their role.
        <br><br>
    </p>
    
    <div id="q1_plot" class="left_plot">
    </div>
    <br>

    <p>
        So far, we see that the minimum, maximum, and average win rates for champions within each role is roughly the same, indicating that the game is balanced quite well in terms of roles. However, looking at the IQR (interquartile ranges) for the roles, show that the variance in win rates for champions differ a bit depending on their role. We see that the adc (bot) role has quite a large IQRs, indicating that some adc champions may perform significantly better than other adc champions, and vice versa. On the other hand, mid lane and support have lower IQRs, indicating that the performance of players in those roles do not differ as much, based on what champion they are playing. From this, you can decide if you want to play a more consistent role, or one with more variance between champions, that may perform vastly differently based on circumstances at hand and your execution.
    </p>

</div>

<div id="q2">

    <p>
        In League of Legends, there are 3 general interactions that can happen in relation to damage, dealing damage, taking (tanking) damage, and mitigating (shielding/healing) damage. In a way, these 3 interactions are similar to the old trifecta of RPG (role playing game) classes, damage dealers, tanks, and healers. Taking inspiration from that, we will take a look at how these 3 damage interactions differ when it comes to different roles. To this end, we will visualize a stacked bar chart displaying the damage (dealt, taken, and mitigated) per minute for each role.
    </p>

    <div id="q2_plot" class="left_plot">
    </div>
    <br>

    <p>
        Continuing with the RPG analogy, we can see that the top lane and jungle role seem to have more tank champions than the other roles, as they are on average, taking more damage compared to other damage interactions than other roles. In a similar vein, we see that mid laners and bot laners seem to deal the most damage, while supports mitigate the most damage, proportional to other damage types. Very loosely, we can define top and jungle to have more tank champions, mid and bot to have more damage dealers, and support to have more healers on average. We can then recommend you the top or jungle role if you mainly play tank classes in RPGs, mid or bot if you like being the damage dealer, or support if you tend to play healer classes. 
    </p>

</div>


<div id="q4">

    <h3>Choose a Champion:</h3>

    <p>
        In the game, not every champion can be played effectively in every role. The game is balanced around expecting champions to be played in a certain set of roles. As a result, playing champions in roles they aren't generally played in, can lead to unpredictable results. As a result, we will ignore those cases when analyzing which champions to pick. Since we have chosen a role already, we can narrow down the overall champion pool to only analyze champions that are commonly played within that role. 
        <br><br>
        To decide which champion to pick, we will take two things into consideration, how the champion performs compared to other champions within the role, and at what stage of the game does that champion perform the best. 
        <br><br>
        In each match of League of Legends, there are two champions from each role fighting each other, one on each team. For example, there will generally always be one mid lane champion fighting another mid lane champion. To look at how a champion performs compared to other champions, we will visualize champion interactions in a network where champions are linked by their winrates playing against each other. For simplicity's sake, we will avoid displaying the fully connected network, and only display connections in regards to a chosen “central” champion, where each link represents that “central” champion’s winrate playing against the other linked champion.
        <br><br>
        To this end, for experienced players, we propose two dichotomies of use:
        <ol>
            <li>
                Choose a champion you already like to play, find the champions they are countered by (perform poorly against), and then learn the counters to those champions.
            </li>
            <li>
                Choose a champion you particularly dislike playing against and learn the counters for them.
            </li>
        </ol>
        For new players, we propose exploring the network graph for a given role, and selecting a champion whose design piques your interest. And or, continue onto the next section and choose a champion by looking at how they perform at different stages of the game. 
        <br><br>
    </p>
    
    Role:
    <select id="q4_roleSelector">
        <option value="mid">Mid</option>
        <option value="jng">Jungle</option>
        <option value="top">Top</option>
        <option value="bot">Bottom</option>
        <option value="sup">Support</option>
    </select>
        Champion: <input type="text" id="q4_champSelector">
    <button class='submit_button' id='q4_submitButton'>Generate</button>

    <div id="q4_plot" class="left_plot">
    </div>
    <br>

</div>


<div id="q3">

    <p>
        Each match of League of Legends is generally divided into 3 different stages depending on the time of the game, early game, mid game, and late game. Most champions spike (are at their most powerful) at one of these stages. Certain champions may perform better in the early game, aiming to crush their opponent early and prevent them from playing the game, while other champions prefer to slowly gain resources and get stronger during the early and mid game, spiking at late game, to become near unkillable raid bosses. To investigate this breakdown, we will take a look at the winrates of champions at different stages of the game. Most matches of League of Legends last between 15 minutes (earliest time a team can surrender) and 60 minutes. For simplicity's sake, we have divided games into 4 bins by their game length, with the first bin representing games that ended in the early game, middle two representing games that ended in the mid game, and the last bin representing games that ended in the late game.
        <br><br>
        After choosing a role and champion(s), the visualization will be generated, allowing you to compare the performance(s) of your chosen champion(s) at different stages of the game. For example, Gwen is a late game champion as she grows during the early and mid game and performs the best in the late game.
    </p>

    Role:
    <select id="q3_roleSelector">
        <option value="top">Top</option>
        <option value="jng">Jungle</option>
        <option value="mid">Middle</option>
        <option value="bot">Bottom</option>
        <option value="sup">Support</option>
    </select>
        Champion(s): 
        <input type="text" id="q3_champSelector" placeholder="Gwen">
        <button class='submit_button' id='q3_submitButton'>Generate</button>

        <div id="q3_plot" class="left_plot">
        </div>

</div>


<div id="q5">

        <h3>Choose a Region and Find a Pro Player to Learn From:</h3>

        <p>
        Now that we have chosen both a role and a champion, the meat of our task has been completed. All we have left is to find a region and pro player to learn the champion from. For this, we would like to choose a player who performs well on the chosen champion. 
        <br><br>
        This task is not as simple as it seems, since League of Legends is played all across the globe. Regions where the game is played must be taken into account due to potential language barriers between learning players and prospective pro players. As a result, you may be more inclined to look at pro players from your home region, or regions which share a commonly spoken language, such as North America and Europe.
        <br><br>
        To further break down regional differences, we must also think about cultural and societal differences in these regions. Certain regions may be more inclined to play certain champions, meaning that those regions may have more overall experience with that champion compared to other regions. For example, there may be more Chinese players with experience playing Xin Zhao and Ahri, as their designs are, respectively, inspired by the imperial Chinese military general Lu Bu, and the mythological fox spirits.
        <br><br>
        Taking into account these regional differences, we can compare regional winrates for your selected champion, to find the region with the highest average win rate on that champion.
        <br><br>
        Then we can take a look at the best performing players on that champion for the selected region. We can then select a player and learn from how they play, either through streaming platforms, if they’re on one, or match replays through the in-game client.
        </p>

        Champion: 
        <input type="text" id="q5_champSelector" placeholder="Alistar">
        <button class='submit_button' id='q5_submitButton'>Generate</button>

        <div id="q5_plot" class="left_plot">
        </div>

</div>

<script>
    final_project()
</script>

