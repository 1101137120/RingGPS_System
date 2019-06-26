
exports.postRingInfos = function (req, res, next) {
    var customErr = new Error();
    var errorMessages = new Array();            
    customErr.status = 400;
    //var tagInstance = new TagInstance();		
    console.log("postRingInfospostRingInfos---------------------------");
    var ringUUID = req.body.ringUUID;
    var ringDateNow = req.body.ringDateNow;
    var ringTimeNow = req.body.ringTimeNow;
    var ringReservseDate = req.body.ringReservseDate;
    var ringReservseTime = req.body.ringReservseTime;
    
    console.log("ringUUID" + ringUUID);
    console.log("ringDateNow" + ringDateNow);
    console.log("ringTimeNow" + ringTimeNow);
    console.log("ringReservseDate" + ringReservseDate);
    console.log("ringReservseTime" + ringReservseTime);

    if (customErr.message !== "") {
        next(customErr);
    }
    else {
        
        
        

            var apiOutput = {};
            apiOutput.status = "success";
            apiOutput.message = "readers found";
            apiOutput.response = "PPPP";
            res.json(apiOutput);


    }
};

function getClientIp(req) {
    var ipAddress;
    // The request may be forwarded from local web server.
    var forwardedIpsStr = req.header('x-forwarded-for');
    if (forwardedIpsStr) {
        // 'x-forwarded-for' header may return multiple IP addresses in
        // the format: "client IP, proxy 1 IP, proxy 2 IP" so take the
        // the first one
        var forwardedIps = forwardedIpsStr.split(',');
        ipAddress = forwardedIps[0];
    }
    if (!ipAddress) {
        // If request was not forwarded
        ipAddress = req.connection.remoteAddress;
    }
    return ipAddress;
};
var validation = {
    isEmailAddress: function (str) {
        var pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return pattern.test(str);  // returns a boolean
    },
    isNotEmpty: function (str) {
        var pattern = /\S+/;
        return pattern.test(str);  // returns a boolean
    },
    isNumber: function (str) {
        var pattern = /^\d+$/;
        return pattern.test(str);  // returns a boolean
    },
    isSame: function (str1, str2) {
        return str1 === str2;
    }
};   