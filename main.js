import './style.css'
// import javascriptLogo from './javascript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.js'
import AgoraRTC from "agora-rtc-sdk-ng"

let options = 
{
    // Pass your App ID here.
    appId: 'f4cb0d08297741f3a3d99c1746093b65',
    // Set the channel name.
    channel: 'Call2',
    // Pass your temp token here.
    token: '007eJxTYDDs/HjqsvzJRyJ+0zL7/WfrneNtcivZ/qKH3/S8Rvu5qycUGNJMkpMMUgwsjCzNzU0M04wTjVMsLZMNzU3MDCyNk8xM952uTWkIZGRI8hdnYmSAQBCflcE5MSfHiIEBAJ9GH5M=',
    // Set the user ID.
    uid: 0,
};

let channelParameters =
{
  // A variable to hold a local audio track.
  localAudioTrack: null,
  // A variable to hold a remote audio track.
  remoteAudioTrack: null,
    // A variable to hold the remote user id.
  remoteUid: null,
};

async function startBasicCall()
{
  // Create an instance of the Agora Engine
  const agoraEngine = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  
  // Listen for the "user-published" event to retrieve an AgoraRTCRemoteUser object.
  agoraEngine.on("user-published", async (user, mediaType) =>
  {
    // Subscribe to the remote user when the SDK triggers the "user-published" event.
    await agoraEngine.subscribe(user, mediaType);
    console.log("subscribe success");

    // Subscribe and play the remote audio track.
    if (mediaType == "audio")
    {
      channelParameters.remoteUid=user.uid;
      // Get the RemoteAudioTrack object from the AgoraRTCRemoteUser object.
      channelParameters.remoteAudioTrack = user.audioTrack;
      // Play the remote audio track. 
      channelParameters.remoteAudioTrack.play();
      showMessage("Remote user connected: " + user.uid);
    }

    // Listen for the "user-unpublished" event.
    agoraEngine.on("user-unpublished", user =>
    {
      console.log(user.uid + "has left the channel");
      showMessage("Remote user has left the channel");
    });
  });

  window.onload = function ()
  {
    // Listen to the Join button click event.
    document.getElementById("join").onclick = async function ()
    {
      // Join a channel.
      await agoraEngine.join(options.appId, options.channel, options.token, options.uid);
      showMessage("Joined channel: " + options.channel);
      // Create a local audio track from the microphone audio.
      channelParameters.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      // Publish the local audio track in the channel.
      await agoraEngine.publish(channelParameters.localAudioTrack);
      console.log("Publish success!");
    }
    
    // Listen to the Leave button click event.
    document.getElementById('leave').onclick = async function ()
    {
      // Destroy the local audio track.
      channelParameters.localAudioTrack.close();
      // Leave the channel
      await agoraEngine.leave();
      console.log("You left the channel");
      // Refresh the page for reuse
      window.location.reload();
    }
  }
}

function showMessage(text){
  document.getElementById("message").textContent = text;
}

startBasicCall();

// document.querySelector('#app').innerHTML = `
//   <div>
//     <a href="https://vitejs.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
//       <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
//     </a>
//     <h1>Hello Vite!</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite logo to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector('#counter'))
