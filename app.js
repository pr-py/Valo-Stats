console.log("started..")

const userAction = async () => {

    var flist = {
        "AgentPP": 6969,
        "Raz1a": 7233,
        "Mandark": 1337,
        "SniperLag": 9424,
        "Darkknight1": 4637,
        "Wolfstien20": 2429
    }

    var mode_list = ["Competitive", "Swiftplay", "Deathmatch","Spike Rush", "Unrated", "Escalation"];

    //"https://api.henrikdev.xyz/valorant/v3/matches/ap/AgentPP/6969"
    displayLoading();
    var p = document.getElementById('player');
    p = p.options[p.selectedIndex].text;

    var md = document.getElementById('match');
    md = md.selectedIndex;


    const response = await fetch('https://api.henrikdev.xyz/valorant/v3/matches/ap/' + p + '/' + flist[p]);
    const myJson = await response.json(); //extract JSON from the http response
    // do something with myJson

    //"https://api.henrikdev.xyz/valorant/v1/mmr-history/ap/AgentPP/6969"

    const response1 = await fetch('https://api.henrikdev.xyz/valorant/v1/mmr-history/ap/' + p + '/' + flist[p]);
    const myJson1 = await response1.json(); //extract JSON from the http response

    hideLoading();

    var i, j, d, flag = 0;

    document.getElementById('show').style.visibility = 'visible';

    //Player Info table

    //document.getElementById('player_info').innerHTML = "<tr><td>Agent Played</td><td>"+myJson['data'][0]['players']['all_players'][i]['character']+"</td></tr>";

    var team_color, agent_played, agent_icon, rank, rank_img;
    var mode, rounds_played, rounds_won, rounds_lost, map_name;

    //console.log(myJson);


    for (i = 0; i < 5; i++) {

        mode = myJson['data'][i]['metadata']['mode'];

        for (j = 0; j < 10; j++) {
            if (myJson['data'][i]['players']['all_players'][j]['name'] == p && mode == mode_list[md]) {

                document.getElementById('player_name').innerText = p;

                team_color = myJson['data'][i]['players']['all_players'][j]['team'];
                agent_played = myJson['data'][i]['players']['all_players'][j]['character'];

                rank = myJson1['data'][i]['currenttierpatched'];
                rank_img = myJson1['data'][i]['images']['small'];
                map_name = myJson['data'][i]['metadata']['map'];

                rounds_played = myJson['data'][i]['metadata']['rounds_played'];
                rounds_won = myJson['data'][i]['teams'][team_color.toLowerCase()]['rounds_won'];
                rounds_lost = myJson['data'][i]['teams'][team_color.toLowerCase()]['rounds_lost'];

                

                document.getElementById('player_info').innerHTML = "<tr><td>Rank</td><td>" + "<img style='width:60%; height:60%' src=" + rank_img + "><br>" + rank + "</td></tr>";
                document.getElementById('player_info').innerHTML += "<tr><td>Level</td><td>" + myJson['data'][i]['players']['all_players'][j]['level'] + "</td></tr>";

                document.getElementById('player_card').style.backgroundImage = "url(" + JSON.stringify(myJson['data'][i]['players']['all_players'][j]['assets']['card']['large']) + ")";
                agent_icon = myJson['data'][i]['players']['all_players'][j]['assets']['agent']['small'];

                d = myJson['data'][i]['players']['all_players'][j]['stats'];
                flag = 1;
                break;
            }
        }
        if (flag == 1)
            break;
    }

    //Match info table



    var result;
    if (rounds_won > rounds_lost)
        result = "Won";
    else if (rounds_won < rounds_lost)
        result = "Lost"
    else
        result = "Draw";

    document.getElementById('match_info').innerHTML = "<tr><th>Match Info: " + result + "</th><th></th></tr>";

    document.getElementById('match_info').innerHTML += "<tr><td>Map</td><td>" + map_name + "</td></tr>";

    document.getElementById('match_info').innerHTML += "<tr><td>Mode</td><td>" + mode + "</td></tr>";
    document.getElementById('match_info').innerHTML += "<tr><td>Agent Played</td><td><img style='width:20%; height:20%' src='" + agent_icon + "'><br>" + agent_played + "</td></tr>";
    document.getElementById('match_info').innerHTML += "<tr><td>Rounds Played</td><td>" + rounds_played + "</td></tr>";
    document.getElementById('match_info').innerHTML += "<tr><td>Rounds Won/Lost</td><td>" + rounds_won + "/" + rounds_lost + "</td></tr>";


    document.getElementById('player_info').innerHTML += "<tr><td>Current RR</td><td>" + myJson1['data'][0]['ranking_in_tier'] + "</td></tr>";
    if (mode == "Competitive")
        document.getElementById('match_info').innerHTML += "<tr><td>RR received</td><td>" + myJson1['data'][0]['mmr_change_to_last_game'] + "</td></tr>";

    var kills, deaths;
    document.getElementById('stats').innerHTML = "<tr><th>Player Stats</th><th></th></tr>";
    for (var key in d) {
        if (key == "kills")
            kills = d[key];
        if (key == "deaths")
            deaths = d[key];
        document.getElementById('stats').innerHTML += "<tr><td>" + key + "</td> <td>" + d[key] + "</td></tr>";
    }
    var kd = kills / deaths;
    document.getElementById('stats').innerHTML += "<tr><td>K/D</td> <td>" + Math.round(kd * 10) / 10 + "</td></tr>";


    //hideLoading();
}

const loader = document.querySelector("#loading");

// showing loading
function displayLoading() {
    loader.classList.add("display");
    // to stop loading after some time
    setTimeout(() => {
        loader.classList.remove("display");
    }, 6000);
}

// hiding loading 
function hideLoading() {
    loader.classList.remove("display");
}
