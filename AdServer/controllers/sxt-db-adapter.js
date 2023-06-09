const DBAdapter = require("./db-adapter");
const Session = require("../api/Session");
const { getAuthToken } = require("../utils/authToken");
const url_dql = process.env.URL_DQL
const url_dml = process.env.URL_DML
const at = getAuthToken()

function getHeaders(tableName){
    let authToken = getAuthToken()
    let biscuit
    if(tableName === 'session'){
        biscuit = process.env.BISCUIT_SESSION
    }else if(tableName === 'event') {
        biscuit = process.env.BISCUIT_EVENT
    } else if(tableName === 'ads') {
        biscuit = process.env.BISCUIT_ADS
    }

    const headers = {
        'Content-Type': 'application/json',
        'Accept':'application/json',
        'Authorization':'Bearer '+authToken,
        'biscuit': biscuit
    }

    return headers
}

class SxtDBAdapter extends DBAdapter {
    async AddSessionToStorage(session) {
        try {
            let db_reply = await fetch(url_dql,{
                method:'POST',
                headers:getHeaders("session"),
                body:JSON.stringify({
                    "resourceId": "ADSERVER.sessions_table_test",
                    "sqlText":"Select * from ADSERVER.sessions_table_test WHERE session_id = '"+session.sessionId+"'"
                })
            })
            const mySession = await db_reply.json()
            // console.log('mySession',mySession)
            if(mySession.length > 0){
                let db_reply = await fetch(url_dml,{
                    method:'POST',
                    headers:getHeaders("session"),
                    body:JSON.stringify({
                        "resourceId": "ADSERVER.sessions_table_test",
                        "sqlText":"UPDATE ADSERVER.sessions_table_test SET tracked_events = '"+JSON.stringify(session.getTrackedEvents())+"' WHERE session_id = '"+session.sessionId+"'"
                    })
                })
                // console.log("sessionId",session.sessionId)
                // console.log("event",session.getTrackedEvents())
                console.log(await db_reply.json())
            } else {
                const getSession = session.toJSON()
                //console.log('getSession',getSession)
                let db_reply = await fetch(url_dml,{
                    method:'POST',
                    headers:getHeaders("session"),
                    body:JSON.stringify({
                        "resourceId": "ADSERVER.sessions_table_test",
                        "sqlText":"Insert into ADSERVER.sessions_table_test(id,session_id, user_id, ad_break_dur, created, host, cli_req, response, tracked_events, content_creator,publication_id)"+
                        "values ('"+getSession.session_id+"','"+getSession.session_id+"','"+getSession.user_id+"','"+getSession.ad_break_dur+"','"+getSession.created+"','"+getSession.host+"','"+getSession.cli_req+"','"+getSession.response+"','"+getSession.tracked_events+"','"+getSession.content_creator+"','"+getSession.publication_id+"')"
                    })
                })
                db_reply = await db_reply.json()
                if(db_reply[0].UPDATED == 1){
                    return getSession.session_id
                }
            }
        } catch (error) {
            console.log('error',error)
        }
    }

    // Get a list of running test sessions.
    async getAllSessions(opt) {
        try {
        let pagi_db_reply = await this._Paginator({
            targetHost: opt.targetHost,
            pageNum: opt.page,
            pageLimit: opt.limit
        });
        // TURN IT BACK TO SESSION CLASS OBJECT
        pagi_db_reply.data = pagi_db_reply.data.map((session) => {
            //console.log('session',session)
            let new_session = new Session();
            new_session.fromJSON(session);
            //console.log('new_session',new_session)
            return new_session;
        });
        return pagi_db_reply;
        } catch (err) {
        throw err;
        }
    }

      // Get a list of running test sessions.
    async getSessionsByUserId(userId) {
        try {
            let db_reply = await fetch(url_dql,{
                method:'POST',
                headers:getHeaders("session"),
                body:JSON.stringify({
                    "resourceId": "ADSERVER.sessions_table_test",
                    "sqlText":"Select * from ADSERVER.sessions_table_test WHERE user_id = '"+userId+"' order by created desc"
                })
            })
            db_reply = await db_reply.json()
            // TODO: decide if should respond with 404 || []
            if (db_reply.length === 0) {
            return null;
            }
            // TURN IT BACK TO SESSION CLASS OBJECT
            db_reply = db_reply.map((session) => {
            let new_session = new Session();
            new_session.fromJSON(session);
            return new_session;
            });
            return db_reply;
        } catch (err) {
            throw err;
        }
    }

      // Get information of a specific test session.
    async getSession(sessionId) {
        try {
            // Might return array if copies exists.
            let db_reply = await fetch(url_dql,{
                method:'POST',
                headers:getHeaders("session"),
                body:JSON.stringify({
                    "resourceId": "ADSERVER.sessions_table_test",
                    "sqlText":"Select * from ADSERVER.sessions_table_test WHERE session_id = '"+sessionId+"'"
                })
            })
            db_reply = await db_reply.json()
            
            if (db_reply.length == 0) {
            return null;
            }
            //console.log(db_reply[0])
            // TURN IT BACK TO SESSION CLASS OBJECT
            let new_session = new Session();
            new_session.fromJSON(db_reply[0]);
            return new_session;
        } catch (err) {
            throw err;
        }
    }

    async DeleteSession(sessionId) {
        try {
            let db_reply = await fetch(url_dml,{
                method:'POST',
                headers:getHeaders("session"),
                body:JSON.stringify({
                    "resourceId": "ADSERVER.sessions_table_test",
                    "sqlText":"DELETE ADSERVER.sessions_table_test WHERE session_id = '"+sessionId+"'"
                })
            })
            db_reply = await db_reply.json()
            return db_reply; 
        } catch (err) {
            return err;
        }
    }

    async _Paginator(opt) {
        if (!opt) {
        return false;
        }
        const limit = parseInt(opt.pageLimit, 10) || 80;
        const page = parseInt(opt.pageNum, 10) || 1;
        const startAt = (page - 1) * limit;
        const getTotalPages = (limit, totalCount) => Math.ceil(totalCount / limit);
        const getNextPage = (page, limit, total) => (total / limit) > page ? page + 1 : null;
        const getPreviousPage = page => page <= 1 ? null : page - 1;

        try {
            let db_reply = await fetch(url_dql,{
                method:'POST',
                headers:getHeaders("session"),
                body:JSON.stringify({
                    "resourceId": "ADSERVER.sessions_table_test",
                    "sqlText":"Select COUNT(*) as count from ADSERVER.sessions_table_test"
                })
            })
        let total = await db_reply.json()
        total = total[0]
        console.log('total',total)
        db_reply = await fetch(url_dql,{
                method:'POST',
                headers:getHeaders("session"),
                body:JSON.stringify({
                    "resourceId": "ADSERVER.sessions_table_test",
                    "sqlText":"Select * from ADSERVER.sessions_table_test where host = '"+opt.targetHost+"' Order by created desc LIMIT "+limit+""
                })
            })
        let rawSessions = await db_reply.json()

        return {
            previousPage: getPreviousPage(page),
            currentPage: page,
            nextPage: getNextPage(page, limit, total.count),
            totalPages: getTotalPages(limit, total.count),
            limit: limit,
            totalItems: parseInt(total.count),
            data: rawSessions,
        };
        } catch (e) {
        console.log(e);
        throw e;
        }
  }
  //Event table 
  async AddEventToStorage(event) {
        console.log('event',event)
        try {
            let db_reply = await fetch(url_dml,{
                method:'POST',
                headers:getHeaders("event"),
                body:JSON.stringify({
                    "resourceId": "ADSERVER.events_table_test",
                    "sqlText":"Insert into ADSERVER.events_table_test(id,session_id, event_type, on_ads, issued_at, user_agent,content_creator,earning,is_paid)"+
                    "values ('"+event.id+"','"+event.sessionId+"','"+event.type+"','"+event.onAd+"','"+event.issuedAt+"','"+event.userAgent+"','"+event.contentCreator+"','"+event.earning+"','0')"
                })
            })
            db_reply = await db_reply.json()
            if(db_reply[0].UPDATED == 1){
                return event.session_id
            }
        } catch (error) {
            console.log('error',error)
        }
    }

    async getCreatorPaymentStatus() {
        try {
            let db_reply = await fetch(url_dql,{
                method:'POST',
                headers:getHeaders("event"),
                body:JSON.stringify({
                    "resourceId": "ADSERVER.events_table_test",
                    "sqlText":"select SUM(cast(earning as double)) earnings,ON_ADS,CONTENT_CREATOR,IS_PAID from ADSERVER.EVENTS_TABLE_TEST where EVENT_TYPE in ('vast:adImpression','click') GROUP by ON_ADS,CONTENT_CREATOR"
                })
            })
            db_reply = await db_reply.json()
            return db_reply
        } catch (error) {
            console.log('error',error)
        }
    }

    async getEventInsight() {
        try {
            let db_reply = await fetch(url_dql,{
                method:'POST',
                headers:getHeaders("event"),
                body:JSON.stringify({
                    "resourceId": "ADSERVER.events_table_test",
                    "sqlText":"select distinct count(*) as INSIGHT,ON_ADS,EVENT_TYPE from ADSERVER.EVENTS_TABLE_TEST where EVENT_TYPE in ('vast:adImpression','click') and IS_PAID in (0,1) GROUP by ON_ADS, EVENT_TYPE"
                })
            })
            db_reply = await db_reply.json()
            return db_reply
        } catch (error) {
            console.log('error',error)
        }
    }

  //Ads table
    async AddAdsToStorage(ads) {
        try {
            const getAds = ads.toJSON()
            let db_reply = await fetch(url_dml,{
                method:'POST',
                headers:getHeaders("ads"),
                body:JSON.stringify({
                    "resourceId": "ADSERVER.ads_table_test",
                    "sqlText":"Insert into ADSERVER.ads_table_test(universal_id, id,ads_name,url,duration,bitrate,width,height,codec,category,budget_total, impression, click,ads_status,created_at,company)"+
                    "values ('"+getAds.universal_id+"','"+getAds.id+"','"+getAds.ads_name+"','"+getAds.url+"','"+getAds.ads_duration+"','"+getAds.bitrate+"','"+getAds.width+"','"+getAds.height+"','"+getAds.codec+"','"+getAds.category+"','"+getAds.budget+"','"+getAds.impression_bd+"','"+getAds.click_bd+"','"+getAds.ads_status+"','"+getAds.created_at+"','"+getAds.company+"')"
                })
            })
            db_reply = await db_reply.json()
            if(db_reply[0].UPDATED == 1){
                return getAds.id
            }
        } catch (error) {
            console.log('error',error)
        }
    }

    async getAllAds() {
        let adsArray,eventsArray,remainingBudget,clickCount,impressionCount
        try {
            let db_reply = await fetch(url_dql,{
                method:'POST',
                headers:getHeaders("ads"),
                body:JSON.stringify({
                    "resourceId": "ADSERVER.ads_table_test",
                    "sqlText":"Select * from ADSERVER.ads_table_test where ads_status <> 'COMPLETED' order by created_at LIMIT 5"
                })
            })
            db_reply = await db_reply.json()
            adsArray = db_reply
            if(db_reply.length>0){
                eventsArray = await this.getEventInsight()
                console.log(eventsArray)
                if(eventsArray.length > 0) {
                    adsArray.map(async (i, index) => {
                        const clickCountArray = eventsArray.filter(o1 => {
                            return o1.ON_ADS === i.ID && o1.EVENT_TYPE === 'click'
                        })
                        const impressionCountArray = eventsArray.filter(o1 => {
                            return o1.ON_ADS === i.ID && o1.EVENT_TYPE === 'vast:adImpression'
                        })
                        if(clickCountArray.length > 0 && impressionCountArray.length > 0) {
                            remainingBudget =parseFloat(i.BUDGET_TOTAL) - ((clickCountArray[0].INSIGHT * parseFloat(i.CLICK)) + (impressionCountArray[0].INSIGHT * parseFloat(i.IMPRESSION)))
                            clickCount = clickCountArray[0].INSIGHT
                            impressionCount = impressionCountArray[0].INSIGHT
                        }
                        if(remainingBudget <= 0 ) {
                            await this.updateAdsStatus("COMPLETED",i.ID)
                            i.ADS_STATUS = 'COMPLETED'
                        } else if (remainingBudget >= 0) {
                            await this.updateAdsStatus("RUNNING",i.ID)
                            i.ADS_STATUS = 'RUNNING'
                        }
                    })
                    return adsArray
                }
                else{
                    return db_reply
                }
            }
        } catch (error) {
            console.log('error',error)
        }
    }

    async updateAdsStatus(status,adsId){
        try {
            let db_reply = await fetch(url_dml,{
                method:'POST',
                headers:getHeaders("ads"),
                body:JSON.stringify({
                    "resourceId": "ADSERVER.ads_table_test",
                    "sqlText":"UPDATE ADSERVER.ads_table_test SET ads_status = '"+status+"' where id = '"+adsId+"'"
                })
            })
            db_reply = await db_reply.json()
            if(db_reply[0].UPDATED == 1){
                return true
            }
            
        } catch (error) {
            console.log(error)
        }
    }

      // Get a list of ads by company.
      async getAdsByCompany(companyName) {
        try {
            let db_reply = await fetch(url_dql,{
                method:'POST',
                headers:getHeaders("ads"),
                body:JSON.stringify({
                    "resourceId": "ADSERVER.ads_table_test",
                    "sqlText":"Select * from ADSERVER.ads_table_test WHERE company = '"+companyName+"' order by created_at desc"
                })
            })
            db_reply = await db_reply.json()
            // TODO: decide if should respond with 404 || []
            if (db_reply.length === 0) {
            return null;
            }
            return db_reply;
        } catch (err) {
            throw err;
        }
    }

    // Get a list of ads by adsID.
    async getAdsById(adsId) {
        console.log("Select * from ADSERVER.ads_table_test WHERE id = '"+adsId+"' order by created_at desc")
        try {
            let db_reply = await fetch(url_dql,{
                method:'POST',
                headers:getHeaders("ads"),
                body:JSON.stringify({
                    "resourceId": "ADSERVER.ads_table_test",
                    "sqlText":"Select * from ADSERVER.ads_table_test WHERE id = '"+adsId+"' order by created_at desc"
                })
            })
            db_reply = await db_reply.json()
            console.log('ADS',db_reply)
            if (db_reply.length === 0) {
            return null;
            }
            return db_reply;
        } catch (err) {
            throw err;
        }
    }


}

module.exports = SxtDBAdapter;