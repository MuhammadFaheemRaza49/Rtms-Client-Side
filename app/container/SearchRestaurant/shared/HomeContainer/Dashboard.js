class Dashboard {
    constructor(dasboard) {
        const {Banners, Stats,WeCare, AppRelease,FunnelKey,ReferUserBanner,EnableVoting, AdditionalParams, Currency,CountryIso,AddParams} = dasboard
        const {GeneralIssues=[]} = WeCare
        let pushBanner = null;

        if (AdditionalParams?.PushBanner) {
            let search = null;
            if (AdditionalParams.PushBanner.Search) {
                search = {
                    "service_id": AdditionalParams.PushBanner.Search.ServiceId,
                    "departure_id": AdditionalParams.PushBanner.Search.DepartureId,
                    "arrival_id": AdditionalParams.PushBanner.Search.ArrivalId,
                    "depDate": AdditionalParams.PushBanner.Search.DepDate,
                    "vertical": AdditionalParams.PushBanner.Search.Vertical
                }
            }
            pushBanner = {
                "title": AdditionalParams.PushBanner.Title,
                "description": AdditionalParams.PushBanner.Description,
                "icon": AdditionalParams.PushBanner.Icon,
                "enable": AdditionalParams.PushBanner.Enable,
                "date": AdditionalParams.PushBanner.Date,
                "count": AdditionalParams.PushBanner.Count,
                "type": AdditionalParams.PushBanner.Type,
                "screenName": AdditionalParams.PushBanner.ScreenName,
                "nestedScreen": AdditionalParams.PushBanner.NestedScreen,
                "button": AdditionalParams.PushBanner.Button,
                "search": search
            }
        }
        this.user = {
            points: (Stats && Stats?.LoyaltyPoints) ? Stats.LoyaltyPoints : 0,
            credits: (Stats && Stats?.WalletCredits) ? Stats.WalletCredits : 0,
        };
        this.recommended = {
            movie: (Banners && Array.isArray(Banners)) ? Banners : []
        };
        this.updatebus = AdditionalParams?.BusCacheModifiedAt;
        this.updateAirport = AdditionalParams?.AirportsCacheModifiedAt;
        this.app_info = {
            force_update: AppRelease.force_update === 1,
            version: AppRelease.version
        }
        this.pushBanner = pushBanner;
        this.ReferUserBanner = ReferUserBanner;
        this.cricket = AdditionalParams?.Cricket?.Widget?AdditionalParams.Cricket?.Widget:null;
        this.google_api_key = ((AdditionalParams && AdditionalParams.GoogleApiKey) ? AdditionalParams.GoogleApiKey : "")
        this.in_app_update = ((AdditionalParams && AdditionalParams.InAppUpdate) ? AdditionalParams.InAppUpdate : false)
        this.todayoffer = AdditionalParams?.Cricket?.Widget?AdditionalParams.Cricket?.TodayOffer:null;
        this.services = (AdditionalParams && AdditionalParams.Services && Array.isArray(AdditionalParams.Services) ? AdditionalParams.Services : [])
        this.currency=Currency??[]
        this.country_iso=CountryIso
        this.funnel_key=FunnelKey
        this.we_care=WeCare
        this.enable_voting=EnableVoting
        this.general_issues=GeneralIssues.length>0?GeneralIssues.map((item)=>({label:item.Label,value:item.Value,serviceType:item.ServiceType})):[]
        this.add_params=AddParams
    }
}


export default Dashboard
