import React, { useEffect, useState, createRef, useRef } from "react";
import Base from "./Base";
import web3 from "../script/_web3";
import MetaMaskOnboarding from '@metamask/onboarding';
import '../css/Company.css'
import axios from "axios"
import w3adsinstance from '../script/w3ads'
import {generate} from 'generate-serial-number'


function Company() {
    const adsServer = process.env.REACT_APP_ADSERVER_URL
    const [contractStatus, setContractStatus] = useState(false);
    const [accounts, setAccounts] = useState('')
    const [id, setId] = useState('');
    const [loading, setLoading] = useState(true)
    const [adsName, setAdsName] = useState('')
    const [budget, setBudget] = useState('')
    const [adsDuration, setAdsDuration] = useState('')
    const [adsStatus, setAdsStatus] = useState('')
    const [url, setURL] = useState('')
    const [bitrate,setBitrate] = useState('')
    const [width,setWidth] = useState('')
    const [formVisibility, setFormVisibility] = useState(true)
    const [height, setHeight] = useState('')
    const [codec, setCodec] = useState('');
    const [category, setCategory] = useState('');
    const [impressionBd, setImpressionBd] = useState('');
    const [clickBd, setClickBd] = useState('')
    const [errorMessage,setErrorMessage] = useState('')
    const [adsArray, setadsArray] = useState([]);
    const [eventArray, setEventArray] = useState([]);




    useEffect(() => {
        handleAccount()
    }, []);

    const handleAccount = async () => {
        function handleNewAccounts(newAccounts) {
            setAccounts(newAccounts);
            console.log(process.env.REACT_APP_ADSERVER_URL)
        }
        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
            await window.ethereum
                .request({ method: 'eth_requestAccounts' })
                .then(handleNewAccounts);
            await window.ethereum.on('accountsChanged', handleNewAccounts);
            return async () => {
                await window.ethereum.off('accountsChanged', handleNewAccounts);
            };
        }

    }
    useEffect(()=>{
        if(accounts.length > 0) {
        axios.get(adsServer+'/ads/'+accounts[0])
        .then(function (response) {
            // handle success
            if(response.data.length > 0){
                var adsData = response.data
                setadsArray(adsData)
                setContractStatus(true)
            }
            console.log(response.data)
          })
          .catch(function (error) {
            // handle error
            console.log(error);
          })
        }
    },[accounts])

    useEffect(()=>{
        axios.get(adsServer+'/eventInsight')
        .then(function (response) {
            // handle success
            if(response.data.length > 0){
                var eventData = response.data
                setEventArray(eventData)
            }
            console.log(response.data)
          })
          .catch(function (error) {
            // handle error
            console.log(error);
          })
    },[])

    function RenderAdsTableRow(){
        let remainingBudget,clickCount,impressionCount,Budget_click,Budget_impression
        remainingBudget = 0.0
        Budget_click = 0.0
        Budget_impression = 0.0
        if(eventArray.length > 0){
        const eventInArray = eventArray.filter(o1 => {
            return adsArray.some(function (o2) {
                return o1.ON_ADS === o2.ID; 
           });
        })
        console.log('eventInArray',eventInArray)
        return (adsArray.map((i, index) => {
            const clickCountArray = eventInArray.filter(o1 => {
                return o1.ON_ADS === i.ID && o1.EVENT_TYPE === 'click'
            })
            const impressionCountArray = eventInArray.filter(o1 => {
                return o1.ON_ADS === i.ID && o1.EVENT_TYPE === 'vast:adImpression'
            })
            // console.log('clickCount',clickCountArray[0].INSIGHT)
            // console.log('impressionCount',impressionCountArray[0].INSIGHT)
            // console.log('totalBudget',i.BUDGET_TOTAL)
            if(clickCountArray.length > 0 ) {
                Budget_click = (clickCountArray[0].INSIGHT * parseFloat(i.CLICK))
                clickCount = clickCountArray[0].INSIGHT
            }
            if(impressionCountArray.length > 0) {
                Budget_impression =  (impressionCountArray[0].INSIGHT * parseFloat(i.IMPRESSION))
                impressionCount = impressionCountArray[0].INSIGHT
            }  

            remainingBudget = parseFloat(i.BUDGET_TOTAL) - (Budget_click + Budget_impression)

            if(remainingBudget < 0){
                remainingBudget = 0.0
            }else if (remainingBudget === 0 ){
                remainingBudget = parseFloat(i.BUDGET_TOTAL)
            }
            
            console.log('remainingBudget',remainingBudget)
            return (
            <tr key = {index} >
                <th scope="row">{i.ID}</th>
                <td>{i.ADS_NAME}</td>
                <td>{i.CATEGORY}</td>
                <td>{i.DURATION}</td>
                <td>{i.ADS_STATUS}</td>
                <td>{i.BUDGET_TOTAL}</td>
                <td>{Number((remainingBudget).toFixed(2))}</td>
                <td>{clickCount || 0}</td>
                <td>{impressionCount || 0}</td>
            </tr>
            )
            }))
        }
    }

    function AdsTB() {

        console.log(adsArray)

        if (adsArray.length > 0) {
            return (
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Id</th>
                            <th scope="col">Name</th>
                            <th scope="col">Category</th>
                            <th scope="col">Duration</th>
                            <th scope="col">Status</th>
                            <th scope="col">Budget</th>
                            <th scope="col">Budget Remain</th>
                            <th scope="col">Total Click</th>
                            <th scope="col">Total Impression</th>
                        </tr>
                    </thead>
                    <tbody>
                        <RenderAdsTableRow/>
                    </tbody>
                </table>
            )
        } else {
            return (
                <div>
                    <span className="text-danger fw-bold">Opps!!!! Didn't find any approved request.</span>
                </div>
            )
        }


    }

    const SecondsToTimeFormat = (seconds, includeFrame) => {
        const sec = parseInt(seconds, 10);
      
        let h = Math.floor(sec / 3600);
        let m = Math.floor((sec - h * 3600) / 60);
        let s = sec - h * 3600 - m * 60;
      
        if (h < 10) {
          h = "0" + h;
        }
        if (m < 10) {
          m = "0" + m;
        }
        if (s < 10) {
          s = "0" + s;
        }
      
        if (includeFrame && seconds.toString().includes(".")) {
          const timeSplit = seconds.toString().split(".");
          const frame = Array.isArray(timeSplit) ? timeSplit[1] : "0";
          return h + ":" + m + ":" + s + "." + frame.substr(0, 3);
        }
        return h + ":" + m + ":" + s;
      };
    

    const onSubmit = async (event) => {
        var serialNumber = generate(5)
        setErrorMessage('')
        event.preventDefault()
        setLoading(false)
        const adsId = adsName+'_'+serialNumber
        const adsBudgetInMatic = budget - ((budget*30)/100)
        const adsBudgetInWei = web3.utils.toWei(adsBudgetInMatic.toString(), 'ether')
        const feeWei = web3.utils.toWei(budget.toString(), 'ether')
        try {
            const result = await w3adsinstance.methods.createAds(adsId, adsBudgetInWei).send({
                value: feeWei,
                from: accounts[0]
            })
            axios.post(adsServer+'/ads', {
                id: adsId,
                adsName: adsName,
                company: accounts[0],
                budget: adsBudgetInMatic,
                adsDuration: SecondsToTimeFormat(adsDuration),
                adsStatus: "NEW",
                url: url,
                bitrate: bitrate,
                width: width,
                height: height,
                codec: codec,
                category: category,
                impressionBd: impressionBd,
                clickBd: clickBd,   
              })
              .then(function (response) {
                console.log(response);
                setLoading(true)
                window.location.reload()
                
              })
              .catch(function (error) {
                setErrorMessage(error)
                setLoading(true)
              });

        } catch (err) {
            setErrorMessage(err.message)
            setLoading(true)
        }
        
    }

    
    return (
        <Base>
            <div className="CompanyContainer">
                <h3 className="card-title m-2 text-center">Company Portal</h3>
                <div className="container card shadow">
                    <div className="accordion accordion-flush mt-2" id="issuerFlush">
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="register-heading">
                                <button className={`accordion-button ${!contractStatus ? '' : 'collapsed'} fw-bold`} type="button" data-bs-toggle="collapse" data-bs-target="#register-collapse" aria-expanded={!{ contractStatus }} aria-controls="register-collapse">
                                    Create Advertisement
                                </button>
                            </h2>
                            <div id="register-collapse" className={`accordion-collapse ${!contractStatus ? 'show' : 'collapse'}`} aria-labelledby="register-heading" data-bs-parent="#issuerFlush">
                                <div className="accordion-body">
                                    <p>Fill the below form and create new an Advertisement.
                                    </p>
                                    <form className="m-2" style={{ height: '100%' }} onSubmit={onSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="companyAddress" className="form-label">Company Address</label>
                                            <span id="companyAddress" aria-describedby="companyAddressHelp" type='text'
                                                className="form-control" style={{ background: "#e9ecef" }}
                                            >{accounts[0]} </span>
                                            <div id="companyAddressHelp" className="form-text">e.g."Company address."</div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="adsName" className="form-label">Advertisement Name</label>
                                            <input id="adsName" aria-describedby="adsNameHelp" type='text'
                                                className="form-control"
                                                value={adsName}
                                                onChange={(event) => setAdsName(event.target.value)}
                                                required

                                            />
                                            <div id="adsNameHelp" className="form-text">e.g."Advertisement Name"</div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="URLInput" className="form-label">Video Link</label>
                                            <input id="URLInput" aria-describedby="URLInputHelp" type='text'
                                                className="form-control"
                                                value={url}
                                                onChange={(event) => setURL(event.target.value)}
                                                required

                                            />
                                            <div id="URLInputHelp" className="form-text">"Enter your uploaded video link" e.g https://example.com/video1</div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="category" className="form-label">Advertisement Category</label>
                                            <select id="category" className="form-select" aria-describedby="categoryHelp"
                                                value={category}
                                                onChange={(event) => setCategory(event.target.value)}>
                                                <option value="Entertainment">Entertainment</option>
                                                <option value="Sport">Sport</option>
                                            </select>
                                            <div id="categoryHelp" className="form-text">"Enter you advertisement category" e.g Entertainment, Sport</div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="AdsDurationInput" className="form-label">Duration</label>
                                            <input id="AdsDurationInput" aria-describedby="AdsDurationInputHelp" type='text'
                                                className="form-control"
                                                value={adsDuration}
                                                onChange={(event) => setAdsDuration(event.target.value)}
                                                required

                                            />
                                            <div id="AdsDurationInputHelp" className="form-text">"Enter your advertisement duration in second" e.g 30,40,10</div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="BudgetInput" className="form-label">Budget</label>
                                            <input id="BudgetInput" aria-describedby="BudgetInputHelp" type='text'
                                                className="form-control"
                                                value={budget}
                                                onChange={(event) => setBudget(event.target.value)}
                                                required

                                            />
                                            <div id="BudgetInputHelp" className="form-text">"Enter your advertisement budget in Matic" e.g 10 Matic</div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="ImpressionBdInput" className="form-label">Impression Budget</label>
                                            <input id="ImpressionBdInput" aria-describedby="ImpressionBdInputHelp" type='text'
                                                className="form-control"
                                                value={impressionBd}
                                                onChange={(event) => setImpressionBd(event.target.value)}
                                                required

                                            />
                                            <div id="ImpressionBdInputHelp" className="form-text">"Enter your advertisement impression budget" e.g 0.001 Matic,0.05 Matic</div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="ClickBdInput" className="form-label">Click Budget</label>
                                            <input id="ClickBdInput" aria-describedby="ClickBdInputHelp" type='text'
                                                className="form-control"
                                                value={clickBd}
                                                onChange={(event) => setClickBd(event.target.value)}
                                                required
                                            />
                                            <div id="ClickBdInputHelp" className="form-text">"Enter your advertisement click budget" e.g 0.1 Matic,0.5 Matic</div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="BitrateInput" className="form-label">Video Bitrate</label>
                                            <input id="BitrateInput" aria-describedby="BitrateInputHelp" type='text'
                                                className="form-control"
                                                value={bitrate}
                                                onChange={(event) => setBitrate(event.target.value)}
                                                required

                                            />
                                            <div id="BitrateInputHelp" className="form-text">"Enter your video's Bitrate" e.g 17700</div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="WidthInput" className="form-label">Video Width</label>
                                            <input id="WidthInput" aria-describedby="WidthInputHelp" type='text'
                                                className="form-control"
                                                value={width}
                                                onChange={(event) => setWidth(event.target.value)}
                                                required

                                            />
                                            <div id="WidthInputHelp" className="form-text">"Enter your video's width" e.g 1920,1080</div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="HeightInput" className="form-label">Video Height</label>
                                            <input id="HeightInput" aria-describedby="HeightInputHelp" type='text'
                                                className="form-control"
                                                value={height}
                                                onChange={(event) => setHeight(event.target.value)}
                                                required

                                            />
                                            <div id="HeightInputHelp" className="form-text">"Enter your video's height" e.g 1080,760</div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="CodecInput" className="form-label">Video Codec</label>
                                            <input id="CodecInput" aria-describedby="CodecInputHelp" type='text'
                                                className="form-control"
                                                value={codec}
                                                onChange={(event) => setCodec(event.target.value)}
                                                required

                                            />
                                            <div id="CodecInputHelp" className="form-text">"Enter your video's codec" e.g H.264</div>
                                        </div>
                                        <span className="text-danger" hidden={!errorMessage}>{errorMessage}</span>
                                        <div className="mb-3 d-flex" style={{ alignItems: 'center' }}>
                                            <button type="submit" className="btn btn-dark form-control" disabled={(!loading)}>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" hidden={loading}></span>
                                                Create Advertisement</button>
                                        </div>
                                        <div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="create-heading">
                                <button className={`accordion-button ${contractStatus ? '' : 'collapsed'} fw-bold`} type="button" data-bs-toggle="collapse" data-bs-target="#create-collapse" aria-expanded={{ contractStatus }} aria-controls="create-collapse">
                                    View Advertisement
                                </button>
                            </h2>
                            <div id="create-collapse" className={`accordion-collapse ${contractStatus ? 'show' : 'collapse'}`} aria-labelledby="create-heading" data-bs-parent="#issuerFlush">
                                <div className="accordion-body">
                                    <AdsTB />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container card shadow" hidden={!contractStatus}>
                </div>
            </div>
        </Base>
    )
}

export default Company