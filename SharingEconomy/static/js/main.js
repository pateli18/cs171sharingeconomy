
var textTypeInterval = 50;
var basePause = 1000;
var slideRun = {2:true, 3:true, 4:true, 5:true, 6:true, 8:true, 10:true};

var sharingEconomyText = 'The Sharing Economy is a new economic model where people earn money by allowing other people to use their underutilized assets (cars, rooms, etc.).';
var rideSharingText = 'Ride Sharing is the largest subsector of the Sharing Economy and involves software platforms matching those people who have cars to those people who need rides.';
var uberIntroText = "Uber is the largest of these software platforms. This site visualizes Uber's and by extension the Sharing Economy's rise and its effects on key stakeholders - taxi cabs, customers, and drivers.";

var driverDecisionText = 'Jonathan recently lost his job and is looking for work.';
var driverCarText = 'He wonders if he should work for a taxi company or use his own car to drive for Uber or another ride-sharing service.';
var driverNycText = 'He takes a closer look at the largest taxi market in the US, New York City.';

var consumerDecisionText = 'Tansaya is a student at Harvard University.';
var consumerQuestionText = 'She needs to get to the airport and is deciding whether to take an Uber or taxi.';
var consumerMoneyText = 'She examines the prices to help make a decision.';

var uberOrderText = 'Tansaya decides to order an Uber and is picked up by Jonathan.';
var uberDropoffText = 'After dropping Tansaya off at the airport, Jonathan receives his first payment from Uber.';
var uberDecisionText = 'He wants to figure out if he should keep driving for Uber or look for a different job.';

var surveyText = 'As you can see, value created through the rise of the sharing economy appears unevenly distributed. Some stakeholders are positioned to gain more than others, while some may be left worse off than they were before. Who do you think are the winners and losers of the sharing economy? Vote below and see how your votes compare to everyone elses!';

var slideInfo = {2:[{text: sharingEconomyText, id: 'sharing-economy-description'},{text: rideSharingText, id: 'ride-sharing-description'},{text: uberIntroText, id: 'uber-introduction'}],
4:[{text:driverDecisionText, id:'driver-decision-description'},{text:driverCarText, id:'driver-car-description'},{text:driverNycText, id:'driver-nyc-description'}],
6:[{text:consumerDecisionText, id:'consumer-decision-description'},{text:consumerQuestionText, id:'consumer-question-description'},{text:consumerMoneyText, id:'consumer-money-description'}],
8:[{text:uberOrderText, id:'uber-order-description'}, {text:uberDropoffText, id:'uber-dropoff-description'}, {text:uberDecisionText, id:'uber-decision-description'}],
10:[{text:surveyText, id:'survey-description'}]};

$(function() {
    $('#fullPage')
        .fullpage({

            navigation: true,
            menu: '#main-menu',
            verticalCentered: false,

            afterLoad: function(anchorLink, index) {
                if (index == 2) {
                    if (slideRun[index]) {
                        var timeDelay = basePause;
                        setTimeout(function() {moveItem('sharing-economy-icon', 0, 50, 100)}, timeDelay);

                        timeDelay += 500;
                        setTimeout(function() {typeText('sharing-economy-description', sharingEconomyText); }, timeDelay);

                        timeDelay += basePause + sharingEconomyText.length * textTypeInterval;
                        setTimeout(function() {moveItem('sharing-economy-car-icon', 0, 50, 100)}, timeDelay);

                        timeDelay += 500;
                        setTimeout(function() {typeText('ride-sharing-description', rideSharingText); }, timeDelay);

                        timeDelay += basePause + rideSharingText.length * textTypeInterval;
                        setTimeout(function() {moveItem('sharing-economy-uber-icon', 0, 50, 100)}, timeDelay);

                        timeDelay += 500;
                        setTimeout(function() {typeText('uber-introduction', uberIntroText); }, timeDelay);

                        slideRun[index] = false;
                    } else {
                        slideInfo[index].forEach(function(d) {
                            $('#' + d.id).html(d.text);
                        });
                    }

                }
                
                if (index === 3) {
                    if (slideRun[index]) {
                        slideRun[index] = false;
                        setTimeout(timeline_button_click, 1000);
                    }
                }

                if (index == 4) {
                    if (slideRun[index]) {
                        var timeDelay = basePause;
                        setTimeout(function() {moveItem('driver-decision-icon', 0, 50, 100)}, timeDelay);

                        timeDelay += 500;
                        setTimeout(function() {typeText('driver-decision-description', driverDecisionText); }, timeDelay);

                        timeDelay += basePause + driverDecisionText.length * textTypeInterval;
                        setTimeout(function() {moveItem('driver-car-icon', 0, 50, 100)}, timeDelay);

                        timeDelay += 500;
                        setTimeout(function() {typeText('driver-car-description', driverCarText); }, timeDelay);

                        timeDelay += basePause + driverCarText.length * textTypeInterval;
                        setTimeout(function() {moveItem('driver-nyc-icon', 0, 50, 100)}, timeDelay);

                        timeDelay += 500;
                        setTimeout(function() {typeText('driver-nyc-description', driverNycText); }, timeDelay);

                        slideRun[index] = false;
                    } else {
                        slideInfo[index].forEach(function(d) {
                            $('#' + d.id).html(d.text);
                        });
                    }
                }

                if (index == 5) {
                    if (slideRun[index]) {
                        slideRun[index] = false;
                        setTimeout(animateRideVis, 1000);
                    }
                }

                if (index == 6) {
                    if (slideRun[index]) {
                        
                        var timeDelay = basePause;
                        setTimeout(function() {moveItem('consumer-decision-icon', 0, 50, 100)}, timeDelay);

                        timeDelay += 500;
                        setTimeout(function() {typeText('consumer-decision-description', consumerDecisionText); }, timeDelay);

                        timeDelay += basePause + consumerDecisionText.length * textTypeInterval;
                        setTimeout(function() {moveItem('consumer-question-icon', 0, 50, 100)}, timeDelay);

                        timeDelay += 500;
                        setTimeout(function() {typeText('consumer-question-description', consumerQuestionText); }, timeDelay);

                        timeDelay += basePause + consumerQuestionText.length * textTypeInterval;
                        setTimeout(function() {moveItem('consumer-money-icon', 0, 50, 100)}, timeDelay);

                        timeDelay += 500;
                        setTimeout(function() {typeText('consumer-money-description', consumerMoneyText); }, timeDelay);

                        slideRun[index] = false;
                    } else {
                        slideInfo[index].forEach(function(d) {
                            $('#' + d.id).html(d.text);
                        });
                    }
                }

                if (index == 8) {
                    if (slideRun[index]) {
            
                        var timeDelay = basePause;
                        setTimeout(function() {typeText('uber-order-description', uberOrderText); }, timeDelay);
                        setTimeout(function() {moveItem('uber-order-icon', 400, 400, 0)}, timeDelay + 100);

                        timeDelay += basePause + uberOrderText.length * textTypeInterval;
                        setTimeout(function() {moveItem('uber-pickup-icon', 0, 400, 200)}, timeDelay);
                        setTimeout(function() {
                            var uberIcon = document.getElementById('uber-order-icon');
                            uberIcon.style.display = 'none';    
                        }, timeDelay + 1200);
                        

                        timeDelay += 2000;
                        setTimeout(function() {moveItem('uber-pickup-icon', 400, 2000, 800)}, timeDelay);

                        timeDelay += 3000;
                        setTimeout(function() {typeText('uber-dropoff-description', uberDropoffText); }, timeDelay);
                        setTimeout(function() {moveItem('uber-logo-icon', 400, 400, 0)}, timeDelay + 100);
                        setTimeout(function() {moveItem('uber-dropoff-icon', 800, 800, 0)}, timeDelay + 100);

                        timeDelay += basePause + uberDropoffText.length * textTypeInterval;
                        setTimeout(function() {moveItem('uber-money-icon', 400, 700, 200)}, timeDelay);

                        timeDelay += basePause;
                        setTimeout(function() {typeText('uber-decision-description', uberDecisionText); }, timeDelay);

                        slideRun[index] = false;

                    } else {
                        slideInfo[index].forEach(function(d) {
                            $('#' + d.id).html(d.text);
                        });
                    }
                }

                if (index == 10) {
                    if (slideRun[index]) {
                        var timeDelay = basePause;
                        setTimeout(function() {typeText('survey-description', surveyText); }, timeDelay);

                        timeDelay += basePause + surveyText.length * textTypeInterval;
                        setTimeout(function() {
                            $('#survey-container').show();
                            initializeVoteCharts();
                        }, timeDelay);

                        slideRun[index] = false;
                    } else {
                        slideInfo[index].forEach(function(d) {
                            $('#' + d.id).html(d.text);
                        });
                    }
                }

            },

            onLeave: function(index, nextIndex, direction){
                if (nextIndex == 1 || nextIndex == 11) {
                    d3.select('#fp-nav')
                        .selectAll('span')
                        .style('background', 'white');
                } else {
                    d3.select('#fp-nav')
                        .selectAll('span')
                        .style('background', '#333');
                }

                if (index === 3) {
                    timeline_reset_button_click();
                }

            }

        });
});

function typeText(elementId, sentence) {

    var textBloc = document.getElementById(elementId);
    textBloc.innerHTML = "";
    i = 0;

    var typeSentence = setInterval(function() {
        textBloc.innerHTML += sentence.charAt(i);
        i ++;
        if (i >= sentence.length) {
            clearInterval(typeSentence);
        }
    }, textTypeInterval);

}

function moveItem(elementId, startPosition, endPosition, timeInterval) {

    var distance = endPosition - startPosition;
    var distanceMoved = 0;
    var moveIncrement = distance / timeInterval;

    var item = document.getElementById(elementId);
    var itemPosition = startPosition;

    item.style.left = itemPosition + 'px';
    item.style.display = 'inline';

    var moveIcon = setInterval(function() {
        itemPosition += moveIncrement;
        distanceMoved += moveIncrement;
        item.style.left = itemPosition + 'px';
        if (Math.abs(distanceMoved) >= Math.abs(distance)) {
            clearInterval(moveIcon);
        }
    }, 1);

}

function padDate(date, numMonths) {
    date = new Date(date);
    return date.setMonth(date.getMonth() + numMonths);
}

function initializeElements() {
    $( "#surge-slider" ).slider({
        min: 1,
        max: 3,
        step: .5,
        stop: function(event, ui) {
            updateSurgeLabel();
            updateRelativeValue();
        }
    });

    $( "#income-slider" ).slider({
        min: 10,
        max: 100,
        step: 10,
        value:50,
        orientation: 'vertical',
        slide: function(event, ui) {
            incomeSliderMove();
        },
        stop: function(event, ui) {
            incomeSliderMove();
            updateIncomeCharts();
        }
    });
}


