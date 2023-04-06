function final_project(){
    var filePath="../../../../scripts/data/data_processed.csv"
    question0(filePath)
    question1(filePath) // plot 1
    question2(filePath) // plot 2
    question3(filePath) // plot 4
    question4(filePath) // plot 3
    question5(filePath) // plot 5
}

var league_to_region = {'LDL': 'China',
                        'LPL': 'China',
                        'Proving Grounds Circuit': 'NA',
                        'LCSA': 'NA',
                        'LCK': 'South Korea',
                        'UPL': 'NA',
                        'SL': 'EU',
                        'LCK CL': 'South Korea',
                        'NLC': 'EU',
                        'PRM': 'EU',
                        'VCS': 'Pacific',
                        'LMF': 'Latin America',
                        'LCS': 'NA',
                        'UL': 'EU',
                        'PCS': 'Pacific',
                        'EM': 'EU',
                        'LFL': 'EU',
                        'CBLOL': 'Latin America',
                        'LHE': 'Latin America',
                        'LEC': 'EU',
                        'ESLOL': 'EU',
                        'LFL2': 'EU',
                        'LAS': 'NA',
                        'TCL': 'Turkey',
                        'CBLOLA': 'Latin America',
                        'LJL': 'Pacific',
                        'LCO': 'Pacific',
                        'LVP DDH': 'Latin America',
                        'LPLOL': 'EU',
                        'TAL': 'Turkey',
                        'GLL': 'EU',
                        'NEXO': 'EU',
                        'LLA': 'Latin America',
                        'EBL': 'EU',
                        'GL': 'Latin America',
                        'VL': 'Latin America',
                        'HC': 'EU',
                        'WCS': 'International',
                        'HM': 'EU',
                        'PGN': 'EU',
                        'EL': 'Latin America',
                        'MSI': 'International',
                        'DC': 'EU',
                        'IC': 'EU',
                        'CDF': 'EU',
                        'LJLA': 'Pacific',
                        'CT': 'EU',
                        'LCL': 'EU'}

let rowConverter = function (d) {
    return {
        champion: d['champion'],
        damagemitigatedperminute: parseFloat(d['damagemitigatedperminute']),
        damagetakenperminute: parseFloat(d['damagetakenperminute']),
        damagetochampions: parseFloat(d['damagetochampions']),
        damagetochampionsperminute: parseFloat(d['damagetochampions']) / parseFloat(d['gamelength'])*60,
        gameid: d['gameid'],
        gamelength: parseFloat(d['gamelength']),
        league: d['league'],
        region: league_to_region[d['league']],
        playername: d['playername'],
        position: d['position'],
        result: parseInt(d['result']),
        teamname: d['teamname']
    }
}

var question0=function(filePath){
    d3.csv(filePath).then(function(data){
        // console.log(data)
    })
}

var question1=function(filePath){
    d3.csv(filePath, rowConverter).then(function(data){

        console.log(data)

        // PROCESS DATA

        champion_winrates_by_role = d3.rollups(data, v => d3.mean(v, d => d['result']), d => d['position'], d => d['champion'])
        

        // SET UP SVG

        padding = 50
        axes_padding = 10
        names_padding = 0
        title_padding = 30

        svgwidth = $('.page__content').width()
        svgheight = $('.page__content').width()

        svg = d3.select("#q1_plot").append("svg")
                .attr("height", svgheight)
                .attr("width", svgwidth)

        // CREATE SCALES AND AXES

        xScale = d3.scaleBand().domain(champion_winrates_by_role.map(function(d){ return d[0] }))
                                .range([padding + names_padding + axes_padding, svgwidth - padding])
                                .paddingInner(0.05)

        yScale = d3.scaleLinear().domain([d3.min(champion_winrates_by_role, function(role){ return d3.min(role[1], function(d){ return d[1] })}),
                                          d3.max(champion_winrates_by_role, function(role){ return d3.max(role[1], function(d){ return d[1] })})])
                                 .range([svgheight - padding, padding])

        xAxis = svg.append('g')
                    .call(d3.axisBottom(xScale))
                    .attr("transform", "translate(0," + (svgheight - padding + axes_padding) + ")")
        xAxis.selectAll("text").style("text-anchor", "middle")
        xAxis.selectAll('.domain, .tick line').remove()

        yAxis = svg.append('g')
                    .call(d3.axisLeft(yScale))
                    .attr("transform", "translate(" + (padding - axes_padding + axes_padding) + ",0)")
        yAxis.selectAll("text").style("text-anchor", "end")

        // CREATE AXES LABELS AND PLOT TITLE

        svg.append("text")
           .attr("class", "x-label")
           .attr("text-anchor", "middle")
           .attr("x", (xScale.range()[1] - xScale.range()[0])/2 + xScale.range()[0])
           .attr("y", svgheight)
           .text("Roles")

        svg.append("text")
           .attr("class", "y-label")
           .attr("text-anchor", "middle")
           .attr("x", -((yScale.range()[1] - yScale.range()[0])/2 + yScale.range()[0]))
           .attr("y", 0)
           .attr("dy", ".75em")
           .attr("transform", "rotate(-90)")
           .text("Winrate")

        svg.append("text")
           .attr("class", "plot-title")
           .attr("text-anchor", "middle")
           .attr("x", (xScale.range()[1] - xScale.range()[0])/2 + xScale.range()[0])
           .attr("y", 12)
           .text("Distribution of Winrate by Role")    

        // CREATE VISUALIZATION MAIN

        // Create Vertical Lines
        svg.selectAll('.main-lines')
           .data(champion_winrates_by_role)
           .enter()
           .append('line')
           .attr("x1", function(d){ return xScale(d[0]) + xScale.bandwidth()/2 })
           .attr("x2", function(d){ return xScale(d[0]) + xScale.bandwidth()/2 })
           .attr("y1", function(d){

                max_val = d3.max(d[1], function(d){ return d[1] })
                return yScale(max_val)

           })
           .attr("y2", function(d){

                    min_val = d3.min(d[1], function(d){ return d[1] })
                    return yScale(min_val)

            })
           .attr("stroke", "black")

        // Create Boxes
        svg.selectAll("rect")
            .data(champion_winrates_by_role)
            .enter()
            .append("rect")
            .attr('x', function(d, i){return xScale(d[0]) + xScale.bandwidth()/4})
            .attr('y', function(d){

                data_sorted = d[1].map(function(d){ return d[1] }).sort(d3.ascending)
                quartile_3 = d3.quantile(data_sorted, 0.75)
                return yScale(quartile_3)

            })
            .attr('width', function(d){ return xScale.bandwidth()/2})
            .attr('height', function(d){

                data_sorted = d[1].map(function(d){ return d[1] }).sort(d3.ascending)
                quartile_1 = d3.quantile(data_sorted, 0.25)
                quartile_3 = d3.quantile(data_sorted, 0.75)
                return yScale(quartile_1) - yScale(quartile_3)

            })
            .attr('fill', 'steelblue')    
            .attr('stroke', 'black')

        // Create Horizontal Lines

        // Min Lines
        svg.selectAll(".min-lines")
            .data(champion_winrates_by_role)
            .enter()
            .append("line")
            .attr("x1", function(d){ return xScale(d[0]) + xScale.bandwidth()/4})
            .attr("x2", function(d){ return xScale(d[0]) + xScale.bandwidth()*(3/4)})
            .attr("y1", function(d){ 
                min_val = d3.min(d[1], function(d){ return d[1] })
                return yScale(min_val) 
            })
            .attr("y2", function(d){ 
                min_val = d3.min(d[1], function(d){ return d[1] })
                return yScale(min_val)
            })
            .attr("stroke", "black")

        // Median Lines
        svg.selectAll(".max-lines")
            .data(champion_winrates_by_role)
            .enter()
            .append("line")
            .attr("x1", function(d){ return xScale(d[0]) + xScale.bandwidth()/4})
            .attr("x2", function(d){ return xScale(d[0]) + xScale.bandwidth()*(3/4)})
            .attr("y1", function(d){ 
                max_val = d3.max(d[1], function(d){ return d[1] })
                return yScale(max_val) 
            })
            .attr("y2", function(d){ 
                max_val = d3.max(d[1], function(d){ return d[1] })
                return yScale(max_val) 
            })
            .attr("stroke", "black")

        // Max Lines
        svg.selectAll(".max-lines")
            .data(champion_winrates_by_role)
            .enter()
            .append("line")
            .attr("x1", function(d){ return xScale(d[0]) + xScale.bandwidth()/4})
            .attr("x2", function(d){ return xScale(d[0]) + xScale.bandwidth()*(3/4)})
            .attr("y1", function(d){ 
                data_sorted = d[1].map(function(d){ return d[1] }).sort(d3.ascending)
                median_val = d3.quantile(data_sorted, 0.5)
                return yScale(median_val) 
            })
            .attr("y2", function(d){ 
                data_sorted = d[1].map(function(d){ return d[1] }).sort(d3.ascending)
                median_val = d3.quantile(data_sorted, 0.5)
                return yScale(median_val) 
            })
            .attr("stroke", "black")
        
    })
}

var question2=function(filePath){
    d3.csv(filePath, rowConverter).then(function(data){

        // PROCESS DATA

        stacked_keys = ['damagetochampionsperminute', 'damagetakenperminute', 'damagemitigatedperminute']
        color_map = {'damagetochampionsperminute': d3.schemeTableau10[2],
                     'damagetakenperminute': d3.schemeTableau10[0],
                     'damagemitigatedperminute': d3.schemeTableau10[4]}
        

        columnsToAgg = [...stacked_keys]
        columnsToAgg.push('position')
        columnsToAgg.push('gameid')

        by_role = d3.rollups(data, v => Object.fromEntries(columnsToAgg.map(function(col){
                if (col == 'gameid'){
                    return ['count', v.length]
                }
                if (col == 'position'){
                    return ['position', v[0]['position']]
                }
                return [col, d3.mean(v, d => +d[col])]
            })), d => d['position'])
        
        formated_by_role = by_role.map(d => d[1])
        stacked = d3.stack().keys(stacked_keys)(formated_by_role)

        // SET UP SVG

        svgwidth = 800
        svgheight = 800
        padding = 40
        axes_padding = 30
        y_axis_padding = 20
        names_padding = 110
        title_padding = 50

        svg = d3.select("#q2_plot").append("svg")
                .attr("height", svgheight)
                .attr("width", svgwidth)

        // CREATE SCALES AND AXES

        xScale = d3.scaleBand()
                    .domain(formated_by_role.map(function(d){return d['position']}))
                    .range([y_axis_padding + padding + axes_padding, svgwidth - padding])
                    .paddingInner(0.1)

		yScale = d3.scaleLinear()
                    .domain([0, d3.max(formated_by_role, d => d3.sum(stacked_keys.map(key => d[key])))])
                    .range([svgheight - names_padding - padding, title_padding])

        xAxis = svg.append('g')
                    .call(d3.axisBottom(xScale))
                    .attr("transform", "translate(0," + (svgheight - names_padding - axes_padding) + ")")
        xAxis.selectAll("text").style("text-anchor", "end")
                                .attr("dx", "-1em")
                                .attr("dy", "-7")
                                .attr("transform", "rotate(-90)" )
          
        yAxis = svg.append('g')
                    .call(d3.axisLeft(yScale))
                    .attr("transform", "translate(" + (y_axis_padding + axes_padding + y_axis_padding) + ",0)")

        // CREATE AXES LABELS, PLOT TITLE, AND LEGEND

        svg.append("text")
           .attr("class", "x-label")
           .attr("text-anchor", "middle")
           .attr("x", (xScale.range()[1] - xScale.range()[0])/2 + xScale.range()[0])
           .attr("y", svgheight - names_padding + axes_padding)
           .text("Roles")

        svg.append("text")
           .attr("class", "y-label")
           .attr("text-anchor", "middle")
           .attr("x", -((yScale.range()[1] - yScale.range()[0])/2 + yScale.range()[0]))
           .attr("y", 0)
           .attr("dy", ".75em")
           .attr("transform", "rotate(-90)")
           .text("Damage")

        svg.append("text")
           .attr("class", "plot-title")
           .attr("text-anchor", "middle")
           .attr("x", (xScale.range()[1] - xScale.range()[0])/2 + xScale.range()[0])
           .attr("y", 12)
           .text("Distribution of Damage Action Values by Role")

        legend_padding = 5
        legend_box_height = 20
        legend_box_length = (xScale.range()[1] - xScale.range()[0])/3
        legend_text_height = 30

        legend_label_mapping = {'damagetochampionsperminute': 'Damage Dealt Per Minute',
                                'damagetakenperminute': 'Damage Taken Per Minute',
                                'damagemitigatedperminute': 'Damage Mitigated Per Minute'}

        svg.selectAll('.legend-boxes')
           .data(stacked_keys)
           .enter()
           .append('rect')
           .attr('x', function(d, i){ return y_axis_padding + padding + axes_padding + (legend_box_length + legend_padding)*i })
           .attr('y', svgheight - legend_box_height - legend_text_height)
           .attr('width', legend_box_length)
           .attr('height', legend_box_height)
           .attr('fill', function(d){return color_map[d]})
           .attr('stroke', 'black')

        svg.selectAll('.legend-text')
           .data(stacked_keys)
           .enter()
           .append('text')
           .attr('class', 'legend')
           .attr('x', function(d, i){ return y_axis_padding + padding + axes_padding + (legend_box_length + legend_padding)*i })
           .attr('y', svgheight - legend_padding)
           .attr('text-anchor', 'start')
           .text(function(d){return legend_label_mapping[d]})

        // CREATE VISUALIZATION MAIN

        groups = svg.selectAll(".gbars")
                    .data(stacked)
                    .enter()
                    .append("g")
                    .attr("class","gbars")
                    .attr("fill", function(d){return color_map[d['key']]})

        rects = groups.selectAll("rect")
                      .data(d => d)
                      .enter()
                      .append("rect")
                      .attr('x', function(d, i){return xScale(d['data']['position'])})
                      .attr('y', function(d){return yScale(d[1])})
                      .attr('width', function(d){ return xScale.bandwidth()})
                      .attr('height', function(d){return yScale(d[0]) - yScale(d[1])})
                      .attr('stroke', 'black')

    })
}

var question3=function(filePath){
    d3.csv(filePath, rowConverter).then(function(data){

        // PROCESS DATA

        selected_role = 'top'
        selected_champs = ['Akali', 'Gangplank', 'Gwen', 'Jax', 'Malphite', 'Shyvana']
        only_curr_role = d3.filter(data, function(d){ return d['position'] == selected_role })

        gamelength_bins = [[15,25], [25,35], [35,45], [45,60]]

        columnsToAgg = [...gamelength_bins]
        columnsToAgg.push('gameid')
        columnsToAgg.push('champion')

        dmg_by_champ_gamelength = d3.rollups(only_curr_role, group => Object.fromEntries(columnsToAgg.map(function(feature, i){
            if (feature == 'gameid'){
                return ['count', group.length]
            }
            if (feature == 'champion'){
                return ['champion', group[0]['champion']]
            }

            only_curr_bin = d3.filter(group, function(d){ return ((d['gamelength'] / 60) >= feature[0]) && ((d['gamelength'] / 60) < feature[1]) })

            return [feature[0] + '_to_' + feature[1], d3.mean(only_curr_bin, d => (d['result']))]
        })), d => d['champion'])

        legit_pick_threshold = 100
        no_troll_picks = d3.filter(dmg_by_champ_gamelength, function(d){ return d[1]['count'] > legit_pick_threshold })

        only_selected_champs = d3.filter(no_troll_picks, d => selected_champs.includes(d[0]))

        timestamp_keys =  gamelength_bins.map(d => d[0] + '_to_' + d[1])

        winrate_by_timestamp_champ = []
        for (champ of only_selected_champs){
            champ_data = []
            champ_data['champion'] = champ[0]
            for (timestamp of timestamp_keys){
                champ_data.push([timestamp, champ[1][timestamp]])
            }
            winrate_by_timestamp_champ.push(champ_data)
        }

        // SET UP SVG

        padding = 40
        axes_padding = 30
        names_padding = 60
        title_padding = 50

        svgwidth = $('.page__content').width()
        svgheight = $('.page__content').width()

        svg = d3.select("#q3_plot").append("svg")
                .attr("height", svgheight)
                .attr("width", svgwidth)

        // CREATE SCALES AND AXES

        xScale = d3.scaleBand()
                    .domain(timestamp_keys)
                    .range([padding + names_padding, svgwidth - padding])
                    .paddingInner(0.05)

		yScale = d3.scaleLinear()
                    .domain([d3.min(winrate_by_timestamp_champ, function(d){ return d3.min(d, time_val => time_val[1]) }), 
                             d3.max(winrate_by_timestamp_champ, function(d){ return d3.max(d, time_val => time_val[1]) })])
                    .range([svgheight - names_padding - padding, title_padding])

        xAxis = svg.append('g')
                    .call(d3.axisBottom(xScale))
                    .attr("class","x_axis")
        xAxis.attr("transform", "translate(0," + (svgheight - names_padding - padding + axes_padding) + ")")
             .selectAll("text").style("text-anchor", "middle")
          
        yAxis = svg.append('g')
                    .call(d3.axisLeft(yScale))
                    .attr("class","y_axis")
        yAxis.attr("transform", "translate(" + (padding + names_padding - axes_padding) + ",0)")

        colors = d3.schemeTableau10

        // CREATE AXES LABELS, PLOT TITLE, AND LEGEND

        svg.append("text")
           .attr("class", "x-label")
           .attr("text-anchor", "middle")
           .attr("x", (xScale.range()[1] - xScale.range()[0])/2 + xScale.range()[0])
           .attr("y", svgheight - names_padding + axes_padding)
           .text("Game Length Bins (Minutes)")

        svg.append("text")
           .attr("class", "y-label")
           .attr("text-anchor", "middle")
           .attr("x", -((yScale.range()[1] - yScale.range()[0])/2 + yScale.range()[0]))
           .attr("y", 10)
           .attr("dy", ".75em")
           .attr("transform", "rotate(-90)")
           .text("Winrate")

        svg.append("text")
           .attr("class", "plot-title")
           .attr("text-anchor", "middle")
           .attr("x", (xScale.range()[1] - xScale.range()[0])/2 + xScale.range()[0])
           .attr("y", 12)
           .text("Winrate by Game Length")

        label_offset = 5

        // CREATE VISUALIZATION MAIN

        groups = svg.selectAll('.champ-group')
                    .data(winrate_by_timestamp_champ)
                    .enter()
                    .append('g')
                    .attr('class', 'champ-group')
                    .attr('fill', function(d, i){
                        return colors[i]
                    })

        groups.append('text')
              .attr('class', 'champ-label')
              .attr('x', xScale('45_to_60') + xScale.bandwidth()/2 + label_offset)
              .attr('y', d => yScale(d[3][1]) - label_offset)
              .text(d => d['champion'])
              .attr('opacity', 1)

        console.log(winrate_by_timestamp_champ)

        groups.selectAll('.winrate-circle')
              .data(d => d)
              .enter()
              .append('circle')
              .attr('class', 'winrate-circle')
              .attr('cx', function(d){return xScale(d[0]) + xScale.bandwidth()/2 })
              .attr('cy', function(d){return yScale(d[1])})
              .attr('r', 3)

        svg.selectAll('.winrate-path')
            .data(winrate_by_timestamp_champ)
            .enter()
            .append('path')
            .attr('class', 'winrate-path')
            .attr("fill", "none")
            .attr('stroke',function(d, i){
                return colors[i]
            })
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function(d) { return xScale(d[0]) + xScale.bandwidth()/2 })
                .y(function(d) { return yScale(d[1]) })
            )
            
        // INTERACTIVITY

        d3.select('#q3_submitButton').on('click', function(d){

            selected_role = document.getElementById("q3_roleSelector").value
            selected_champs = document.getElementById("q3_champSelector").value
            selected_champs = selected_champs.split(',')
            selected_champs = selected_champs.map(d => d.trim())

            // PROCESS ROLE DATA

            only_curr_role = d3.filter(data, function(d){ return d['position'] == selected_role })
            gamelength_bins = [[15,25], [25,35], [35,45], [45,60]]
            columnsToAgg = [...gamelength_bins]
            columnsToAgg.push('gameid')
            columnsToAgg.push('champion')
            dmg_by_champ_gamelength = d3.rollups(only_curr_role, group => Object.fromEntries(columnsToAgg.map(function(feature, i){
                if (feature == 'gameid'){return ['count', group.length]}
                if (feature == 'champion'){return ['champion', group[0]['champion']]}
                only_curr_bin = d3.filter(group, function(d){ return ((d['gamelength'] / 60) >= feature[0]) && ((d['gamelength'] / 60) < feature[1]) })
                return [feature[0] + '_to_' + feature[1], d3.mean(only_curr_bin, d => (d['result']))]
            })), d => d['champion'])

            legit_pick_threshold = 100
            no_troll_picks = d3.filter(dmg_by_champ_gamelength, function(d){ return d[1]['count'] > legit_pick_threshold })

            only_selected_champs = d3.filter(no_troll_picks, d => selected_champs.includes(d[0]))

            timestamp_keys =  gamelength_bins.map(d => d[0] + '_to_' + d[1])

            winrate_by_timestamp_champ = []
            for (champ of only_selected_champs){
                champ_data = []
                champ_data['champion'] = champ[0]
                for (timestamp of timestamp_keys){
                    champ_data.push([timestamp, champ[1][timestamp]])
                }
                winrate_by_timestamp_champ.push(champ_data)
            }

            // CREATE SCALES, AXES

            yScale = d3.scaleLinear()
                        .domain([d3.min(winrate_by_timestamp_champ, function(d){ return d3.min(d, time_val => time_val[1]) }), 
                                d3.max(winrate_by_timestamp_champ, function(d){ return d3.max(d, time_val => time_val[1]) })])
                        .range([svgheight - names_padding - padding, title_padding])

            d3.selectAll("g.y_axis")
                .transition().duration(1000)
                .call( d3.axisLeft(yScale))

            // CREATE VISUALIZATION MAIN

            d3.selectAll('.winrate-circle').transition().duration(1000).attr('opacity', 0)
            d3.selectAll('.winrate-path').transition().duration(1000).attr('opacity', 0)
            d3.selectAll('.champ-label').transition().duration(1000).attr('opacity', 0)

            setTimeout(() => {
                d3.selectAll('.champ-group').remove()
                d3.selectAll('.winrate-circle').remove()
                d3.selectAll('.winrate-path').remove()
                d3.selectAll('.champ-label').remove()

                svg = d3.select("#q3_plot svg")

                groups = svg.selectAll('.champ-group')
                        .data(winrate_by_timestamp_champ)
                        .enter()
                        .append('g')
                        .attr('class', 'champ-group')
                        .attr('fill', function(d, i){
                            return colors[i]
                        })

                groups.append('text')
                      .attr('class', 'champ-label')
                      .attr('x', xScale('45_to_60') + xScale.bandwidth()/2 + label_offset)
                      .attr('y', d => yScale(d[3][1]) - label_offset)
                      .text(d => d['champion'])
                      .attr('opacity', 0).transition().duration(1000).attr('opacity', 1)

                groups.selectAll('.winrate-circle')
                    .data(d => d)
                    .enter()
                    .append('circle')
                    .attr('class', 'winrate-circle')
                    .attr('cx', function(d){return xScale(d[0]) + xScale.bandwidth()/2 })
                    .attr('cy', function(d){return yScale(d[1])})
                    .attr('r', 3)
                    .attr('opacity', 0).transition().duration(1000).attr('opacity', 1)

                svg.selectAll('.winrate-path')
                    .data(winrate_by_timestamp_champ)
                    .enter()
                    .append('path')
                    .attr('class', 'winrate-path')
                    .attr("fill", "none")
                    .attr('stroke',function(d, i){
                        return colors[i]
                    })
                    .attr("stroke-width", 1.5)
                    .attr("d", d3.line()
                        .x(function(d) { return xScale(d[0]) + xScale.bandwidth()/2 })
                        .y(function(d) { return yScale(d[1]) })
                    )
                    .attr('opacity', 0).transition().duration(1000).attr('opacity', 1)

            }, 1000)
            
        })

    })
}

var question4=function(filePath){
    d3.csv(filePath, rowConverter).then(function(data){

        // PROCESS DATA

        selected_role = 'mid'
        selected_champion = 'Ahri'

        function process_data(selected_role, selected_champion)
        {
            only_selected_role = d3.filter(data, d => d['position'] == selected_role)

            count_by_champ = d3.rollups(only_selected_role, v => v.length, d => d['champion'])
            legit_pick_threshold = 100
            non_troll_picks = d3.filter(count_by_champ, d => d[1] > legit_pick_threshold)
            non_troll_picks = non_troll_picks.map(d => d[0])

            only_selected_role = d3.filter(only_selected_role, d => non_troll_picks.includes(d['champion']))

            by_gameid = d3.groups(only_selected_role, d => d['gameid'])

            complete_matchups = d3.filter(by_gameid, d => (d[1].length > 1))

            match_pairs = complete_matchups.map(function(match){

                temp = {}
                champ_1_data = match[1][0]
                champ_2_data = match[1][1]
                temp['champ_1_name'] = champ_1_data['champion']
                temp['champ_2_name'] = champ_2_data['champion']
                temp['champ_1_result'] = champ_1_data['result']

                return temp

            })

            wr_by_matchup = d3.flatRollup(match_pairs, v => Object.fromEntries(['champ_1_result', 'champ_1_name'].map(function(col){
                    if (col == 'champ_1_name')
                    {
                        return ['count', v.length]
                    }
                    return [col, d3.mean(v, d => +d[col])]
                })), d => d['champ_1_name'], d => d['champ_2_name'])

            unique_matchup_wins = {}

            for (match of wr_by_matchup)
            {
                curr_matchup = match.slice(0,2).sort(d3.ascending)
                curr_matchup = curr_matchup[0] + '_' + curr_matchup[1]

                champ_1 = curr_matchup.split('_')[0]
                count = match[2]['count']
                if (match[0] == champ_1)
                {
                    champ_1_total_win = match[2]['champ_1_result']*count
                }
                else
                {
                    champ_1_total_win = (1 - match[2]['champ_1_result'])*count
                }
                if (Object.keys(unique_matchup_wins).includes(curr_matchup))
                {
                    unique_matchup_wins[curr_matchup] = [champ_1_total_win + unique_matchup_wins[curr_matchup][0], 
                                                        count + unique_matchup_wins[curr_matchup][1]]
                }
                else
                {
                    unique_matchup_wins[curr_matchup] = [champ_1_total_win, count]
                }
            }

            unique_matchup_wrs = []
            for (match of Object.keys(unique_matchup_wins))
            {
                temp = {}
                temp['matchup'] = match
                curr_match_data = unique_matchup_wins[match]
                temp['champ_1_wr'] = curr_match_data[0] / curr_match_data[1]

                unique_matchup_wrs.push(temp)
            }

            unique_champs = []

            for (match of unique_matchup_wrs)
            {
                champions = match['matchup'].split('_')
                for (champ of champions)
                {
                    if (!unique_champs.includes(champ))
                    {
                        if(champions.includes(selected_champion))
                        {
                            unique_champs.push(champ)
                        }
                    }
                }
            }

            matchup_edges = []
            for (matchup of unique_matchup_wrs)
            {
                champions = matchup['matchup'].split('_')
                temp = {}
                if (champions[0] == selected_champion)
                {
                    temp['source'] = unique_champs.indexOf(champions[0])
                    temp['target'] = unique_champs.indexOf(champions[1])
                    temp['wr'] = matchup['champ_1_wr']
                    matchup_edges.push(temp)
                }
                if (champions[1] == selected_champion)
                {
                    temp['source'] = unique_champs.indexOf(champions[1])
                    temp['target'] = unique_champs.indexOf(champions[0])
                    temp['wr'] = matchup['champ_1_wr']
                    matchup_edges.push(temp)
                }
            }

            dataset = {nodes: unique_champs.map(d => Object({name: d})),
                    edges: matchup_edges}

            placeholder_champ = d3.filter(count_by_champ, d => d[1] > legit_pick_threshold).sort((a, b) => 0.5 - Math.random())[0][0]

            return [dataset, placeholder_champ]
        }

        processed_matchup_data = process_data(selected_role, selected_champion)
        dataset = processed_matchup_data[0]
        placeholder_champ = processed_matchup_data[1]
        
        // SET UP TOOLTIP

        Tooltip = d3.select("#q5_plot")
                    .append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0)
                    .style('border-style','solid')
                    .style('border-width', 2)
                    .style('border-color','dimgrey')
                    .style('color', 'dimgrey')
                    .style('border-radius', '4px')

        // SET UP SVG
        
        svgwidth = 800
        svgheight = 800

        svg = d3.select("#q4_plot").append("svg")
                .attr("height", svgheight)
                .attr("width", svgwidth)

        // SET UP SCALES

        linkScale = d3.scaleLinear().domain([d3.min(dataset.edges, d => d['wr']), 
                                             d3.max(dataset.edges, d => d['wr'])])
                                    .range([300, 100])

        colorScale = d3.scaleLinear().domain([d3.min(dataset.edges, d => d['wr']), 
                                              d3.max(dataset.edges, d => d['wr'])])
                                     .range([0, 1])

        // SET UP FORCE SIMULATION

        force = d3.forceSimulation()
                        .nodes(dataset.nodes)
                        .force('link', d3.forceLink(dataset.edges).distance(d => linkScale(d['wr'])))
                        .force('charge', d3.forceManyBody().strength(-4000))
                        .force('collide', d3.forceCollide().radius(2).strength(5))
                        .force('x', d3.forceX(svgwidth/2).strength(0.8))
                        .force('y', d3.forceY(svgheight/2).strength(0.8))

        // CREATE HELPER FUNCTIONS

        parsed_champs = d3.rollups(data, v => v.length, d => d['champion']).map(d => d[0])
        parsed_champs = parsed_champs.map(d => d.toLowerCase().replace(' ', '').replace(' ', '').replace("'", ''))

        svg.append('svg:defs')
           .selectAll('.champ-icons')
           .data(parsed_champs)
           .enter()
           .append("svg:pattern")
           .attr("id", d => d)
           .attr("width", 1)
           .attr("height", 1)
           .append("svg:image")
           .attr("xlink:href", d => '../../../../scripts/data/champion_icons/' + d + '.png')
           .attr("width", 88)
           .attr("height", 88)
           .attr("x", -5)
           .attr("y", -5)

        function drag(simulation){
        
            function dragstarted(event, d) {
                if (!event.active) simulation.alphaTarget(0.3).restart()
                d.fx = d.x
                d.fy = d.y
                }
            function dragged(event, d) {
                d.fx = event.x
                d.fy = event.y
                }
            function dragended(event, d) {
                if (!event.active) simulation.alphaTarget(0)
                d.fx = null
                d.fy = null
                }
            
            return d3.drag().on("start", dragstarted)
                            .on("drag", dragged)
                            .on("end", dragended)
            }

        // INTERACTIVITY HELPERS

        center_node_champion = selected_champion

        function mouseOverHelper(e, d)
        {
            Tooltip.transition().duration(50).style("opacity", 1)

            curr_champ = d3.select(this).data()[0]['name']
            // Highlight Nodes
            d3.selectAll('.champion-node').attr('stroke', function(d)
            {
                if ([center_node_champion, curr_champ].includes(d['name'])){ return 'steelblue'}
                return 'white'
            })
            // Highlight Edge
            d3.selectAll('.matchup-line').attr('stroke', function(d)
            {
                if (d['target']['name'] == curr_champ)
                { 
                    d3.select(this).data()[0]['old_stroke'] = d3.select(this).attr('stroke')
                    return 'steelblue'
                }
                return d3.select(this).attr('stroke')
            })
        }

        function mouseMoveHelper(e, d)
        {
            curr_champ = d3.select(this).data()[0]['name']
            // Find Current Winrate
            for (edge of dataset.edges)
            {
                if(edge['target']['name'] == curr_champ)
                { curr_wr = edge['wr'] }
            }
            curr_wr = Math.round(curr_wr * 100)
            tooltip_text = 'Selected Champion: ' + curr_champ + '<br><br>'
            tooltip_text = tooltip_text + center_node_champion + '\'s winrate against ' + curr_champ + ': ' + curr_wr + '%'
            if(curr_champ == center_node_champion){ tooltip_text = 'Selected Champion: ' + center_node_champion }

            Tooltip.html(tooltip_text)
                   .style("top", (e.pageY - 5)+"px")
                   .style("left",(e.pageX + 20)+"px")
        }

        function mouseOutHelper(e, d)
        {
            Tooltip.transition().duration(50).style("opacity", 0)

            // Highlight Nodes
            d3.selectAll('.champion-node').attr('stroke', 'white')
            curr_champ = d3.select(this).data()[0]['name']
            // Highlight Edge
            d3.selectAll('.matchup-line').attr('stroke', function(d)
            {
                if (d['target']['name'] == curr_champ)
                { 
                    return d3.select(this).data()[0]['old_stroke']
                }
                return d3.select(this).attr('stroke')
            })
        }

        // CREATE VISUALIZATION MAIN

        edges = svg.selectAll(".matchup-line")
                    .data(dataset.edges)
                    .enter()
                    .append("line")
                    .attr('class', 'matchup-line')
                    .attr('fill-opacity', 0)
                    .attr('stroke', 'grey')
                    .attr('stroke-width', 10)
                    .attr('opacity', 0)
                    .attr('stroke', d => d3.interpolateRdYlGn(colorScale(d['wr'])))

        nodes = svg.selectAll(".champion-node")
                    .data(dataset.nodes)
                    .enter()
                    .append("circle")
                    .attr('class', 'champion-node')
                    .attr("r", 40)
                    .attr('stroke', 'whitesmoke')
                    .attr('stroke-width', 4)
                    .attr('opacity', 0)
                    .style('fill', function(d){
                        parsed_name = d['name'].toLowerCase().replace(' ', '').replace("'", '')
                        return "url(#" + parsed_name + ")"
                    })
                    .call(drag(force))
                    // INTERACTIVITY
                    .on("mouseover", mouseOverHelper)
                    .on("mousemove", mouseMoveHelper)
                    .on("mouseout", mouseOutHelper)
        
        // RUN FORCE SIMULATION

        force.on("tick", function() {

            // edges.attr('d', linkArc)

            edges.attr("x1", function(d) { return d.source.x; })
                 .attr("y1", function(d) { return d.source.y; })
                 .attr("x2", function(d) { return d.target.x; })
                 .attr("y2", function(d) { return d.target.y; })

            nodes.attr("cx", function(d) { return d.x; })
                 .attr("cy", function(d) { return d.y; })
            
            }, 1000)

        // CREATE LEGEND

        legend_padding = 5
        legend_box_height = 20
        legend_box_length = 40
        legend_text_height = 10
        legend_role_mapping = {'top': 'Top Lane',
                               'jng': 'Jungle',
                               'mid': 'Mid Lane',
                               'bot': 'Bot Lane',
                               'sup': 'Support'}

        legend_color_vals = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1]
        legend_vals = legend_color_vals.map(d => colorScale.invert(d))

        svg.selectAll('.network-legend-box')
           .data(legend_color_vals)
           .enter()
           .append('rect')
           .attr('class', 'network-legend-box')
           .attr('x', function(d, i){ return (legend_box_length + legend_padding)*i })
           .attr('y', svgheight - legend_box_height - legend_text_height - legend_padding)
           .attr('width', legend_box_length)
           .attr('height', legend_box_height)
           .attr('fill', d => d3.interpolateRdYlGn(d))
           .attr('stroke', 'black')

        svg.selectAll('.network-legend-text')
           .data(legend_vals)
           .enter()
           .append('text')
           .attr('class', 'network-legend-text')
           .attr('x', function(d, i){ return (legend_box_length + legend_padding)*i + legend_box_length/2})
           .attr('y', svgheight)
           .attr('text-anchor', 'middle')
           .text(d => Math.round(d*100) + '%')

        svg.append("text")
            .attr("class", "plot-title")
            .attr("text-anchor", "middle")
            .attr("x", svgwidth / 2)
            .attr("y", 20)
            .text('(' + selected_champion + '\'s) Winrates Against ' + '(' + legend_role_mapping[selected_role] + ') Champions') 

        // FADE NEW VISUALIZATION
        setTimeout(() => {
            d3.selectAll('.matchup-line').transition().duration(1200).attr('opacity', 1)
            d3.selectAll('.champion-node').transition().duration(800).attr('opacity', 1)
        }, 1000)
           
        // CREATE INPUT PLACEHOLDER TEXT

        d3.selectAll('#q4_champSelector').attr('placeholder', selected_champion)

        d3.select('#q4_roleSelector').on('change', function(d){

            selected_role = this.value
            processed_matchup_data = process_data(selected_role, selected_champion)
            placeholder_champ = processed_matchup_data[1]
            d3.selectAll('#q4_champSelector').attr('placeholder', placeholder_champ)

        })

        // INTERACTIVITY

        d3.select('#q4_submitButton').on('click', function(d){

            // PROCESS DATA
            
            selected_role = document.getElementById("q4_roleSelector").value
            selected_champion = document.getElementById("q4_champSelector").value
            center_node_champion = selected_champion
            processed_matchup_data = process_data(selected_role, selected_champion)
            dataset = processed_matchup_data[0]

            // SET UP SCALES 

            linkScale = d3.scaleLinear().domain([d3.min(dataset.edges, d => d['wr']), 
                                                d3.max(dataset.edges, d => d['wr'])])
                                        .range([300, 100])

            colorScale = d3.scaleLinear().domain([d3.min(dataset.edges, d => d['wr']), 
                                                d3.max(dataset.edges, d => d['wr'])])
                                        .range([0, 1])

            // CREATE VISUALIZATION MAIN

            d3.selectAll('.matchup-line').attr('opacity', 1).transition().duration(800).attr('opacity', 0)
            d3.selectAll('.champion-node').attr('opacity', 1).transition().duration(1000).attr('opacity', 0)
            d3.selectAll('.network-legend-box').attr('opacity', 1).transition().duration(1000).attr('opacity', 0)
            d3.selectAll('.network-legend-text').attr('opacity', 1).transition().duration(1000).attr('opacity', 0)

            setTimeout(() => {
                d3.selectAll('.matchup-line').remove()
                d3.selectAll('.champion-node').remove()
                d3.selectAll('.network-legend-box').remove()
                d3.selectAll('.network-legend-text').remove()

                // SET UP FORCE SIMULATION

                force = d3.forceSimulation()
                         .nodes(dataset.nodes)
                         .force('link', d3.forceLink(dataset.edges).distance(d => linkScale(d['wr'])))
                         .force('charge', d3.forceManyBody().strength(-4000))
                         .force('collide', d3.forceCollide().radius(2).strength(5))
                         .force('x', d3.forceX(svgwidth/2).strength(0.8))
                         .force('y', d3.forceY(svgheight/2).strength(0.8))

                // CREATE LEGEND

                legend_color_vals = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1]
                legend_vals = legend_color_vals.map(d => colorScale.invert(d))

                svg.selectAll('.network-legend-box')
                    .data(legend_color_vals)
                    .enter()
                    .append('rect')
                    .attr('class', 'network-legend-box')
                    .attr('x', function(d, i){ return (legend_box_length + legend_padding)*i })
                    .attr('y', svgheight - legend_box_height - legend_text_height - legend_padding)
                    .attr('width', legend_box_length)
                    .attr('height', legend_box_height)
                    .attr('fill', d => d3.interpolateRdYlGn(d))
                    .attr('stroke', 'black')
                    .attr('opacity', 0)

                svg.selectAll('.network-legend-text')
                    .data(legend_vals)
                    .enter()
                    .append('text')
                    .attr('class', 'network-legend-text')
                    .attr('x', function(d, i){ return (legend_box_length + legend_padding)*i + legend_box_length/2})
                    .attr('y', svgheight)
                    .attr('text-anchor', 'middle')
                    .text(d => Math.round(d*100) + '%')
                    .attr('opacity', 0)

                // CREATE VISUALIZATION MAIN

                edges = svg.selectAll(".matchup-line")
                            .data(dataset.edges)
                            .enter()
                            .append("line")
                            .attr('class', 'matchup-line')
                            .attr('fill-opacity', 0)
                            .attr('stroke', 'grey')
                            .attr('stroke-width', 10)
                            .attr('opacity', 0)
                            .attr('stroke', d => d3.interpolateRdYlGn(colorScale(d['wr'])))

                nodes = svg.selectAll(".champion-node")
                            .data(dataset.nodes)
                            .enter()
                            .append("circle")
                            .attr('class', 'champion-node')
                            .attr("r", 40)
                            .attr('stroke', 'whitesmoke')
                            .attr('stroke-width', 4)
                            .attr('opacity', 0)
                            .style('fill', function(d){
                                parsed_name = d['name'].toLowerCase().replace(' ', '').replace("'", '')
                                return "url(#" + parsed_name + ")"
                            })
                            .call(drag(force))
                            // INTERACTIVITY
                            .on("mouseover", mouseOverHelper)
                            .on("mousemove", mouseMoveHelper)
                            .on("mouseout", mouseOutHelper)

                svg.selectAll('.plot-title').text('(' + selected_champion + '\'s) Winrates Against ' + '(' + legend_role_mapping[selected_role] + ') Champions')

                // RUN FORCE SIMULATION

                force.on("tick", function() {

                    edges.attr("x1", function(d) { return d.source.x; })
                        .attr("y1", function(d) { return d.source.y; })
                        .attr("x2", function(d) { return d.target.x; })
                        .attr("y2", function(d) { return d.target.y; })

                    nodes.attr("cx", function(d) { return d.x; })
                        .attr("cy", function(d) { return d.y; })
                    
                    }, 1000)

                // FADE NEW VISUALIZATION
                setTimeout(() => {
                    d3.selectAll('.matchup-line').transition().duration(1000).attr('opacity', 1)
                    d3.selectAll('.champion-node').transition().duration(800).attr('opacity', 1)
                    d3.selectAll('.network-legend-box').transition().duration(800).attr('opacity', 1)
                    d3.selectAll('.network-legend-text').transition().duration(800).attr('opacity', 1)
                }, 500)
            }, 1000)

        })

    })
}

var question5=function(filePath){


    regions_to_country = [[['China'], 'China'],
                          [['United States of America', 'Canada'], 'NA'],
                          [['South Korea'], 'South Korea'],
                          [['United Kingdom', 'France', 'Spain', 'Ireland',
                            'Portugal', 'Netherlands', 'Belgium', 'Italy',
                            'Germany', 'Denmark', 'Switzerland', 'Poland',
                            'Czechia', 'Austria', 'Slovenia', 'Slovakia',
                            'Hungary', 'Croatia', 'Bosnia and Herz.',
                            'Greece', 'Macedonia', 'Albania', 'Bulgaria',
                            'Serbia', 'Romania', 'Moldova', 'Ukraine',
                            'Kosovo', 'Montenegro', 'Belarus', 'Lithuania',
                            'Latvia', 'Estonia', 'Finland', 'Sweden', 'Norway', 'Russia'], 'EU'],
                          [['Taiwan', 'Vietnam', 'Australia', 'New Zealand',
                            'Japan', 'Papua New Guinea', 'Indonesia', 'Malaysia', 
                            'Philippines', 'Thailand', 'Laos', 'Cambodia',
                            'Myanmar'], 'Pacific'],
                          [['Brazil', 'Peru', 'Ecuador', 'Colombia', 'Venezuela', 'Panama',
                            'Costa Rica', 'Nicaragua', 'Honduras', 'Guatemala',
                            'Mexico', 'El Salvador', 'Belize', 'Cuba',
                            'Dominican Rep.', 'Jamaica', 'Haiti',
                            'Bolivia', 'Paraguay', 'Chile', 'Argentina',
                            'Uruguay', 'Falkland Is.'], 'Latin America'],
                          [['Turkey'], 'Turkey'],
                          [[], 'International']]

    region_display_name = {'China': 'China',
                           'NA': 'North America',
                           'South Korea': 'South Korea',
                           'EU': 'Europe and Russia',
                           'Pacific': 'South East Asia and Oceania',
                           'Latin America': 'Latin America',
                           'Turkey': 'Turkey'}

    function current_region(curr_country)
    {
        for (region_data of regions_to_country){
            if (region_data[0].includes(curr_country)){
                curr_region = region_data[1]
                return curr_region
            }
        }
    }
                     
    d3.csv(filePath, rowConverter).then(function(data){

        // PROCESS DATA

        selected_champion = 'Alistar'
        only_selected_champ = d3.filter(data, d => d['champion'] == selected_champion)

        by_region = d3.rollup(only_selected_champ, v => d3.mean(v, d => d['result']), d => d['region'])

        // CREATE COLOR SCALE

        colorScale = d3.scaleLinear().domain([d3.min(by_region, d => d[1]), d3.max(by_region, d => d[1])])
                                             .range([0, 1])

        // SET UP SVG AND WORLDMAP

        var svgwidth = 800
        var svgheight = 500

        const worldmap = d3.json('../../../../scripts/data/countries.json')

        worldmap.then(function(map){

            countries = topojson.feature(map, map.objects.countries)

            var svg = d3.select("#q5_plot").append("svg")
                        .attr("height", svgheight)
                        .attr("width", svgwidth)

            projection = d3.geoMercator()
                            .scale(100)
                            .translate([svgwidth/2.71, svgheight/1.4])
            path = d3.geoPath(projection)

            Tooltip = d3.select("#q5_plot")
                    .append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0)
                    .style('border-style','solid')
                    .style('border-width', 2)
                    .style('border-color','dimgrey')
                    .style('color', 'dimgrey')
                    .style('border-radius', '4px')

            svg.selectAll('path')
               .data(countries.features)
               .enter()
               .append('path')
               .attr('class', 'map-country')
               .attr('d', path)
               .style('fill', function(d){

                    curr_country = d.properties.name
                    curr_region = current_region(curr_country)
                    curr_region_wr = by_region.get(curr_region)

                    d3.select(this).data()[0]['properties']['region'] = curr_region

                    if(typeof(curr_region_wr)=='undefined'){ return 'lightgrey' }
                    else{ return d3.interpolateBlues(colorScale(curr_region_wr)) }
                    
                })
               .style('stroke', 'white')
               .style('stroke-width', 1)
               // INTERACTIVITY TOOLTIP
                .on("mouseover", function (e, d) {

                    Tooltip.transition().duration(0).style("opacity", 1)

                    selected_region = d3.select(this).data()[0]['properties']['region']
                    d3.selectAll(".map-country").transition().duration(0).style("opacity", function(d){
                        curr_region = d3.select(this).data()[0]['properties']['region']
                        if (curr_region == selected_region) {return 1}
                        else{return 0.5}
                    })

                    })
                .on("mousemove", function (e, d) {

                            // CALCULATE WR
                            curr_country = d.properties.name
                            curr_region = d3.select(this).data()[0]['properties']['region']
                            curr_region_wr = by_region.get(curr_region)

                            if(typeof(curr_region_wr)=='undefined')
                            {
                                tooltip_text =  'N/A' 
                            }
                            else
                            {
                                if (curr_region_wr != 'N/A'){ curr_region_wr = Math.round(curr_region_wr * 100)}

                                // FIND BEST PLAYERS

                                only_curr_region = d3.filter(only_selected_champ, d => d['region'] == curr_region)
                                by_player = d3.rollups(only_curr_region, v => Object.fromEntries(['result', 'count'].map(function(col){
                                    if(col == 'count'){ return  [col, v.length] }
                                    return [col, d3.mean(v, d => +d[col])]
                                })), d => d['playername'])
                                experienced_game_count = 5
                                experienced_players = d3.filter(by_player, d => d[1]['count'] >= experienced_game_count)
                                experienced_players = experienced_players.sort((a, b) => d3.descending(a[1]['result'], b[1]['result']))
        
                                top_n = 5
                                top_n_players = experienced_players.slice(0, top_n)

                                tooltip_text = 'Region: ' + region_display_name[curr_region]
                                tooltip_text = tooltip_text + '<br> Average Winrate: ' + curr_region_wr + '%<br><br>'
                                tooltip_text = tooltip_text + 'Best Players:<br>'

                                i = 1
                                for (player of top_n_players)
                                {
                                    player_winrate = Math.round(player[1]['result'] * 100)
                                    tooltip_text = tooltip_text + i + '. ' + player[0] + ' ' + player_winrate + '% winrate <br>'
                                    i++
                                }
                            }

                            Tooltip.html(tooltip_text)
                                .style("top", (e.pageY - 5)+"px")
                                .style("left",(e.pageX + 20)+"px")

                            selected_region = d3.select(this).data()[0]['properties']['region']
                            d3.selectAll(".map-country").transition().duration(0).style("opacity", function(d){
                                curr_region = d3.select(this).data()[0]['properties']['region']
                                if (curr_region == selected_region) {return 1}
                                else{return 0.5}
                            })

                    })
                .on("mouseout", function (e, d) {

                            Tooltip.transition().duration(0).style("opacity", 0);
                            d3.selectAll(".map-country").transition().duration(0).style("opacity", 1)

                    })

            // CREATE LEGEND AND PLOT TITLE

            geo_legend_padding = 5
            geo_legend_box_height = 20
            geo_legend_box_length = 20
            geo_legend_text_height = 10

            legend_color_vals = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1].sort(d3.descending)
            legend_vals = legend_color_vals.map(d => colorScale.invert(d))

            svg.selectAll('.geo-legend-box')
                .data(legend_color_vals)
                .enter()
                .append('rect')
                .attr('class', 'geo-legend-box')
                .attr('x', svgwidth - 150)
                .attr('y', function(d, i){ return (geo_legend_box_height + geo_legend_padding)*i })
                .attr('width', geo_legend_box_length)
                .attr('height', geo_legend_box_height)
                .attr('fill', d => d3.interpolateBlues(d))
                .attr('stroke', 'black')

            svg.selectAll('.geo-legend-text')
                .data(legend_vals)
                .enter()
                .append('text')
                .attr('class', 'geo-legend-text')
                .attr('x', svgwidth - 150 + geo_legend_box_length + geo_legend_padding)
                .attr('y', function(d, i){ return (geo_legend_box_height + geo_legend_padding)*(i+1) - geo_legend_box_height/2})
                .attr('text-anchor', 'right')
                .text(d => Math.round(d*100) + '%')

            svg.append("text")
                .attr("class", "plot-title")
                .attr("text-anchor", "middle")
                .attr("x", svgwidth / 2.3)
                .attr("y", 20)
                .text('Winrates ' + '(' + selected_champion + ')' + ' by Region') 

            
            // INTERACTIVITY

            d3.select('#q5_submitButton').on('click', function(d){

                // PROCESS DATA
                
                selected_champion = document.getElementById("q5_champSelector").value
                only_selected_champ = d3.filter(data, d => d['champion'] == selected_champion)
                by_region = d3.rollup(only_selected_champ, v => d3.mean(v, d => d['result']), d => d['region'])

                // CREATE COLOR SCALE

                colorScale = d3.scaleLinear().domain([d3.min(by_region, d => d[1]), d3.max(by_region, d => d[1])])
                                             .range([0, 1])

                // MAIN

                svg.selectAll('.map-country')
                    .transition().duration(1000)
                    .style('fill', function(d){

                        curr_country = d.properties.name
                        curr_region = d3.select(this).data()[0]['properties']['region']
                        curr_region_wr = by_region.get(curr_region)

                        if(typeof(curr_region_wr)=='undefined'){ return 'lightgrey' }
                        else{ return d3.interpolateBlues(colorScale(curr_region_wr)) }

                    })

                // UPDATE LEGEND AND PLOT TITLE

                legend_vals = legend_color_vals.map(d => colorScale.invert(d))
                svg.selectAll('.geo-legend-text')
                    .data(legend_vals)
                    .transition()
                    .text(d => Math.round(d*100) + '%')
                svg.selectAll('.plot-title').text('Winrates ' + '(' + selected_champion + ')' + ' by Region')

            })

        })

    })
}


