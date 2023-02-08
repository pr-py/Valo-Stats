
const userAction = async () => {

    var flist = {
        "AgentPP": "6969",
        "Raz1a": "7233",
        "Mandark": "1337",
        "SniperLag": "9424",
        "Darkknight1": "4637",
        "Wolfstien20": "2429"
    }

    var mode_list = ["competitive", "swiftplay", "deathmatch", "spikerush", "unrated", "escalation"];

    displayLoading();

    var p = document.getElementById('player');
    p = p.options[p.selectedIndex].text;

    var md = document.getElementById('match');
    md = md.selectedIndex;

    var pname, ptag, puuid;

    pname = document.getElementById('p_name').value;
    ptag = document.getElementById('p_tag').value;



    if (pname === "" && ptag === "") {
        pname = p;
        ptag = flist[p];
    }

    if (pname === "" && ptag !== "") {
        alert("Please enter Player Name!");
        hideLoading();

    }
    else if (pname !== "" && ptag === "") {
        alert("Please enter Tag!");
        hideLoading();

    }
    else {

        //"https://api.henrikdev.xyz/valorant/v1/account/AgentPP/6969"

        const rsp = await fetch('https://api.henrikdev.xyz/valorant/v1/account/' + pname + '/' + ptag);
        const mj = await rsp.json();



        puuid = mj['data']['puuid'];


        //"https://api.henrikdev.xyz/valorant/v3/matches/ap/AgentPP/6969"

        //"https://api.henrikdev.xyz/valorant/v3/by-puuid/matches/ap/3b5d2584-7570-53f4-8d88-1e6d28bb47a5?filter=competitive&size=1"

        const response = await fetch('https://api.henrikdev.xyz/valorant/v3/by-puuid/matches/ap/' + puuid + '?filter=' + mode_list[md] + '&size=1');
        const myJson = await response.json(); //extract JSON from the http response
        // do something with myJson

        if (myJson['data'].length === 0) {
            alert('No data found!');
            hideLoading();
            return;
        }

        console.log('match data');
        //"https://api.henrikdev.xyz/valorant/v1/mmr-history/ap/AgentPP/6969"

        const response1 = await fetch('https://api.henrikdev.xyz/valorant/v1/mmr-history/ap/' + pname + '/' + ptag);
        const myJson1 = await response1.json(); //extract JSON from the http response



        //hideLoading();

        var i, j, d, dd, flag = 0;

        document.getElementById('show').style.visibility = 'visible';

        //Player Info table

        //document.getElementById('player_info').innerHTML = "<tr><td>Agent Played</td><td>"+myJson['data'][0]['players']['all_players'][i]['character']+"</td></tr>";

        var team_color, agent_played, agent_icon, rank, rank_img;
        var mode, rounds_played, rounds_won, rounds_lost, map_name;

        console.log(myJson);

        i = 0;
        //for (i = 0; i < 5; i++) {

        mode = myJson['data'][i]['metadata']['mode'];
        if (mode === "Spike Rush")
            mode = "spikerush";


        for (j = 0; j < 10; j++) {
            //console.log(escapeUnicode(myJson['data'][i]['players']['all_players'][j]['name']));


            if (myJson['data'][i]['players']['all_players'][j]['name'].normalize('NFC') === pname.normalize('NFC') && myJson['data'][i]['players']['all_players'][j]['tag'].normalize('NFC') === ptag.normalize('NFC') && mode.toLowerCase() == mode_list[md]) {

                //document.getElementById('player_name').innerText = pname;

                team_color = myJson['data'][i]['players']['all_players'][j]['team'];
                agent_played = myJson['data'][i]['players']['all_players'][j]['character'];


                rank = myJson1['data'][i]['currenttierpatched'];
                rank_img = myJson1['data'][i]['images']['small'];
                map_name = myJson['data'][i]['metadata']['map'];

                rounds_played = myJson['data'][i]['metadata']['rounds_played'];
                rounds_won = myJson['data'][i]['teams'][team_color.toLowerCase()]['rounds_won'];
                rounds_lost = myJson['data'][i]['teams'][team_color.toLowerCase()]['rounds_lost'];



                document.getElementById('player_info').innerHTML = "<tr><td>Rank</td><td>" + "<img style='width:40%; height:40%' src=" + rank_img + "><br>" + rank + "</td></tr>";
                document.getElementById('player_info').innerHTML += "<tr><td>Level</td><td>" + myJson['data'][i]['players']['all_players'][j]['level'] + "</td></tr>";

                // document.getElementById('player_card').style.backgroundImage = "url(" + JSON.stringify(myJson['data'][i]['players']['all_players'][j]['assets']['card']['large']) + ")";
                agent_icon = myJson['data'][i]['players']['all_players'][j]['assets']['agent']['small'];

                d = myJson['data'][i]['players']['all_players'][j]['stats'];
                dd = myJson['data'][i]['players']['all_players'];
                flag = 1;
                break;
            }
        }

        //}

        //Match info table


        var result;
        if (rounds_won > rounds_lost)
            result = "Won";
        else if (rounds_won < rounds_lost)
            result = "Lost"
        else
            result = "Draw";

        document.getElementById('match_info').innerHTML = "<tr><th colspan='2'>Match Info: " + result + "</th></tr>";

        document.getElementById('match_info').innerHTML += "<tr><td>Map</td><td>" + map_name + "</td></tr>";

        document.getElementById('match_info').innerHTML += "<tr><td>Mode</td><td>" + mode + "</td></tr>";
        document.getElementById('match_info').innerHTML += "<tr><td>Agent Played</td><td><img style='width:20%; height:20%' src='" + agent_icon + "'><br>" + agent_played + "</td></tr>";
        document.getElementById('match_info').innerHTML += "<tr><td>Rounds Played</td><td>" + rounds_played + "</td></tr>";
        document.getElementById('match_info').innerHTML += "<tr><td>Rounds Won/Lost</td><td>" + rounds_won + "/" + rounds_lost + "</td></tr>";


        document.getElementById('player_info').innerHTML += "<tr><td>Current RR</td><td>" + myJson1['data'][0]['ranking_in_tier'] + "</td></tr>";
        if (mode == "Competitive")
            document.getElementById('match_info').innerHTML += "<tr><td>RR received</td><td>" + myJson1['data'][0]['mmr_change_to_last_game'] + "</td></tr>";

        var kills, deaths;
        document.getElementById('stats').innerHTML = "<tr><th colspan='2'>Player Stats</th></tr>";
        for (var key in d) {
            if (key == "kills")
                kills = d[key];
            if (key == "deaths")
                deaths = d[key];
            document.getElementById('stats').innerHTML += "<tr><td>" + key + "</td> <td>" + d[key] + "</td></tr>";
        }
        var kd = kills / deaths;
        document.getElementById('stats').innerHTML += "<tr><td>K/D</td> <td>" + Math.round(kd * 10) / 10 + "</td></tr>";

        //All players




        document.getElementById('scorecard').innerHTML = "<tr><th>Player Name</th><th>Rank</th><th>Kills</th><th>Deaths</th><th>Assists</th><th>Bodyshots</th><th>Headshots</th><th>Legshots</th><th>Score</th><th>K/D</th></tr>";

        for (i in dd) {

            kills = dd[i]['stats']['kills'];

            deaths = dd[i]['stats']['deaths'];

            var kd = kills / deaths;

            document.getElementById('scorecard').innerHTML += "<tr><td>" + dd[i]['name'] + "</td><td>" + dd[i]['currenttier_patched'] + "</td><td>" + dd[i]['stats']['kills'] + "</td><td>" + dd[i]['stats']['deaths'] + "</td><td>" + dd[i]['stats']['assists'] + "</td><td>" + dd[i]['stats']['bodyshots'] + "</td><td>" + dd[i]['stats']['headshots'] + "</td><td>" + dd[i]['stats']['legshots'] + "</td><td>" + dd[i]['stats']['score'] + "</td><td>" + Math.round(kd * 10) / 10 + "</td></tr>";






        }

        hideLoading();

    }
}

const loader = document.querySelector("#loading");

// showing loading
function displayLoading() {
    loader.classList.add("display");
    // to stop loading after some time
    setTimeout(() => {
        loader.classList.remove("display");
    }, 10000);
}

// hiding loading 
function hideLoading() {
    loader.classList.remove("display");
}

