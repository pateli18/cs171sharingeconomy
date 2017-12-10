var votesData;
var votesChart = {"uber":null, "taxi":null, "consumer":null, "worker":null};
var votesFlag = {"uber":null, "taxi":null, "consumer":null, "worker":null};

function initializeVotes(data) {

  votesData = data;

}

function initializeVoteCharts() {

  for (var key in votesData) {
      var chart = new BarChart(key + '-vote-chart', votesData[key], key);
      votesChart[key] = chart;
  }
}

$('.btn-default').click(function() {
    if ($(this).attr("class").includes('default')) {
      var clickedButton = $(this).attr("id");
      var chosenChart = clickedButton.split("-")[0];
      var vote;
     if (clickedButton.includes('win')) {
         $(this).attr('class', 'btn btn-success');
         $("#" + clickedButton.replace("win", "lose")).attr('class', 'btn btn-default');
         votesData[chosenChart].Win += 1;
         if (votesFlag[chosenChart] != null) {
             votesData[chosenChart].Lose -= 1;
         }
         votesFlag[chosenChart] = true;
         vote = 'Win';
     } else {
         $(this).attr('class', 'btn btn-danger');
         $("#" + clickedButton.replace("lose", "win")).attr('class', 'btn btn-default');
         votesData[chosenChart].Lose += 1;
         if (votesFlag[chosenChart] != null) {
             votesData[chosenChart].Win -= 1;
         }
         votesFlag[chosenChart] = false;
         vote = 'Lose';
     }
      votesChart[chosenChart].data = votesData[chosenChart];
      votesChart[chosenChart].wrangleData();
      saveData(chosenChart, vote)
  }
});

function saveData(stakeholder, vote) {
    var send_data = {'stakeholder':stakeholder, 'vote':vote};
    $.ajax({
        type: 'POST',
        url: window.location.href,
        data: JSON.stringify(send_data),
        dataType: 'json',
        contentType: 'application/json; charset=utf-8'
    });
}