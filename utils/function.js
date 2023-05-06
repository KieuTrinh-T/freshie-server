function convertObjectResult(result) {
    return {
        value: result
    }
}

function convertArrayResult(result) {
    return {
        value: result,
        count: result.length
    }
}

function convertAuthenResult(result) {
    return {
        is_auth: result.is_auth,
        message: result.message
    }
}
module.exports = {
    convertObjectResult,
    convertArrayResult,
    convertAuthenResult
}