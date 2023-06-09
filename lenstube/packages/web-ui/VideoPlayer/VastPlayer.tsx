import type { FC } from 'react'
import React,{useEffect,useState} from 'react'
import AdsManager from 'ads-manager'
//let vastUrl = 'https://eyevinn.adtest.eyevinn.technology/api/v1/vast?dur=15';
import { useAccount} from 'wagmi'
let vastUrl: string

type Props = {
  adsCompleted: () => void,
  creator?:string,
  publicationId?:string
}

const VastPlayer: FC<Props> = ({adsCompleted,creator,publicationId}) => {
  
  const { address, isConnected } = useAccount()

  useEffect(()=>{
    let userAddress,userIP
    fetch("https://ipinfo.io/json?token=0445f07159e3d5").then(
    (response) => response.json()
    ).then(
      (jsonResponse) => {
        userIP = jsonResponse.ip
        if(isConnected) {
          userAddress = address
          console.log("address ", address)
        }else{
          userAddress = '0x0'
        }
        vastUrl = `http://localhost:8080/api/v1/vast?c=1&dur=15&uid=${userAddress}&cc=${creator}&pi=${publicationId}&ss=1000x200&uip=${userIP}`
        init(vastUrl)
      }
    )
  },[])

  function init(vastUrl:string){
    if(!window.location.toString().includes('bytes') && vastUrl !== ''){
      console.log('vastURL ',vastUrl)
    const adContainer = document.getElementById('ad-container');
    const adsManager = new AdsManager(adContainer);
    adsManager._slot.style.position = 'relative'
    adsManager._videoSlot.setAttribute('class', 'c-lioqzt c-lioqzt-fRKYWh-size-contain')
    
    adsManager.addEventListener('AdsManagerLoaded', function() {
      // Get height and width of your video element
      let width = '100%';
      let height = '100%';
      let viewMode = 'normal'; // fullscreen
      // Init
      try {
        adsManager.init(width, height, viewMode);
        adsManager.setVolume(1)
      } catch (adError) {
        console.log("error",adError)
      }
    });
    // AdLoaded
    adsManager.addEventListener('AdLoaded', function(adEvent: { isLinear: () => any }) {
      // Ad loaded, awaiting start
      // Check if ad type is linear
      if(adEvent.isLinear()) {
        try {
          // Start ad
          adsManager.start();

        } catch (adError) {
          // Play video content without ads in case of error
          console.log("error",adError)
        }
      } else {
        // Ad is not linear
        console.log("Ad is not linear")
      }
    });

    adsManager.addEventListener('AdError', function(adError: string) {
      console.log('AdError', adError);
      if(adsManager) {
        // Removes ad assets loaded at runtime that need to be properly removed at the time of ad completion
        // and stops the ad and all tracking.
        adsManager.abort();
        adsCompleted()
      }
    });
    adsManager.addEventListener('AllAdsCompleted', function() {
      // Play your video content
      adsCompleted()
    });
    // Request Ads
    adsManager.requestAds(vastUrl,{muted:true});
    }else{
      adsCompleted()
    }
    
  }

  return (
    <div className="c-PJLV c-IBjNz c-PJLV-cyQVdj-aspectRatio-16to9 c-IBjNz-ejzaPM-size-default livepeer-aspect-ratio-container">
    <div id="ad-container">
    </div>
    {/* <div className="c-PJLV c-hmIsCl c-PJLV-hiRmpy-display-shown">
    <div className="c-cSwjHS">
      <progress id="file" className='c-kvOVlU' value="32" max="100"> 32% </progress>
    </div>
  </div> */}
  </div>
  )
}

export default VastPlayer
