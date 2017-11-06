var video = document.getElementById('video');
var _canvas;

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: 'application/octet-stream'});
}

function getBlob() {
  _canvas = document.createElement("canvas");
  var context = _canvas.getContext('2d')
  context.drawImage(video, 0, 0, _canvas.width, _canvas.height);
  var dataURL = _canvas.toDataURL('image/jpeg', 1.0);
  return dataURLtoBlob(dataURL);
}

/*

  #3 Azurefunction에 request 요청하기

  jQuery Ajax를 이용하여 Azurefunction에 request를 보냅니다.

  #3-1
    request url: YOUR-AZURE-FUNCTION-URL
  #3-2
    request headers spec
    {
      '_id': unique id token (in localStorage)
      'nickname': the value of #inputNickname
      'Content-Type': "application/octet-stream"
    }
  #3-3
    processData: false
  #3-4
    data: blob (using getBlob);
*/

function analyzeImage() {
	var url = 'https://alphaca.azurewebsites.net/api/HttpTriggerJS1?code=5LrKggzCpNWo9Lhf6gAaEpfetACN9dZtpZwDssockYzhi5VGWSKM1Q==';
	var blob = getBlob();
	$.ajax({
		url: url,
		type: 'POST',
		headers: {
			'_id': localStorage.getItem('_id'),
      'nickname': $('#inputNickname').val(),
			'Content-Type': "application/octet-stream",
		},
		processData: false,
		data: blob,
		success: function(data) {
			console.log(data);
      // Age
      $('.age').text(data.result.age);

      // Gender
      if (data.result.gender === "Male") $('.gender').text("👱🏻");
      else if (data.result.gender === "Female") $('.gender').text("👩🏻");

      // emotion
      // 😡😬🤢😨😀😐😭😱
      switch (data.result.emotion) {
        case 'anger':
          $('.emoji').text("😡");
          break;
        case 'contempt':
          $('.emoji').text("😬");
          break;
        case 'disgust':
          $('.emoji').text("🤢");
          break;
        case 'fear':
          $('.emoji').text("😨");
          break;
        case 'happiness':
          $('.emoji').text("😀");
          break;
        case 'neutral':
          $('.emoji').text("😐");
          break;
        case 'sadness':
          $('.emoji').text("😭");
          break;
        case 'surprise':
          $('.emoji').text("😱");
          break;
        default:
          $('.emoji').text("😐");
      }

      // Description
      $('.description').text(data.result.description);
		},
		error: function(err) {
			console.log(err);
		}
	});
}

$(function() {

  /*
  	#1 '_id'라는 token을 생성합니다.

  	최초 접속 시간을 기준으로하여 hash화하며, hash 알고리즘은 SHA256을 사용합니다.
  	생성된 토큰은 localStorage의 '_id'값으로 저장하며, localStorage에 '_id' 토큰이 없는 경우에만 token을 생성하도록 합니다.
  */
	if (localStorage.getItem('_id') === null) {
 			var d = new Date();
 			localStorage.setItem('_id', SHA256(d.toString()));
 	}
	console.log(localStorage.getItem('_id'));

  /*
    #2 웹 브라우저상에 웹캠 스트림을 표시합니다.

    navigator.getUserMedia(constraints, successCallback, errCallback) 메소드를 이용하여
    video 스트림을 받아와 <video/> 태그에 표시합니다.
  */
  navigator.getUserMedia({ video: true },
		function(localMediaStream) {
			video.srcObject = localMediaStream;
		},
		function(err) {
			console.log(err);
		}
	);

  /*
    #4 button이 눌렸을 때 analyzeImage function을 실행시키는 코드를 작성합니다.

    jQuery의 'click' 메소드를 이용합니다.
  */
	$('button').click(function(){
    analyzeImage();
  });



	// setInterval(function() {
	// 	console.log('capture');
	// 	analyzeImage();
	// }, 10*1000);


});
