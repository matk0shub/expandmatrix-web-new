/**
 * returns the session belonging to the transaction of the req.session if exists
 * @returns ClientSession
 */ export async function getSession(db, req) {
    if (!req) {
        return;
    }
    let transactionID = req.transactionID;
    if (transactionID instanceof Promise) {
        transactionID = await req.transactionID;
    }
    if (transactionID) {
        return db.sessions[transactionID];
    }
}

//# sourceMappingURL=getSession.js.map