const logs = [
    { "timestamp": "2024-09-15T08:23:45Z", "user": "Alice", "action": "LOGIN", "details": "User Alice logged in" },
    { "timestamp": "2024-09-15T08:25:12Z", "user": "Alice", "action": "REQUEST", "details": "Requested resource 123" },
    { "timestamp": "2024-09-15T08:27:30Z", "user": "Alice", "action": "LOGOUT", "details": "User Alice logged out" },
    { "timestamp": "2024-09-15T08:35:11Z", "user": "Bob", "action": "LOGIN", "details": "User Bob logged in" },
    { "timestamp": "2024-09-15T08:40:22Z", "user": "Bob", "action": "REQUEST", "details": "Requested resource 124" },
    { "timestamp": "2024-09-15T08:42:08Z", "user": "Bob", "action": "ERROR", "details": "Database connection failed" },
    { "timestamp": "2024-09-15T08:45:15Z", "user": "Alice", "action": "LOGIN", "details": "User Alice logged in" },
    { "timestamp": "2024-09-15T08:50:30Z", "user": "Alice", "action": "REQUEST", "details": "Requested resource 125" },
    { "timestamp": "2024-09-15T08:55:45Z", "user": "Bob", "action": "ERROR", "details": "File not found" },
    { "timestamp": "2024-09-15T09:27:30Z", "user": "Alice", "action": "LOGOUT", "details": "User Alice logged out" },
    { "timestamp": "2024-09-15T09:00:00Z", "user": "Bob", "action": "LOGOUT", "details": "User Bob logged out" },
    { "timestamp": "2024-09-16T08:35:11Z", "user": "Bob", "action": "LOGIN", "details": "User Bob logged in" },
    { "timestamp": "2024-09-16T08:55:45Z", "user": "Bob", "action": "ERROR", "details": "File not found" },
    { "timestamp": "2024-09-16T10:00:00Z", "user": "Bob", "action": "LOGOUT", "details": "User Bob logged out" }
];

// Log processing function
function processLogs(logs) {
    // TODO: Your code here
    if (!logs || logs.length === 0) return {totalActionsPerUser: {},
            sessionDurations: {},
            errorCount: {},
            mostActiveUser: ""};

    const result = {
    totalActionsPerUser: {},
    sessionDurations: {},
    errorCount: {},
    mostActiveUser: ''
};

// ตัวช่วยจำ: เก็บเวลาที่ Login ล่าสุดของแต่ละคนไว้ เพื่อรอตัว Logout มาลบ
    const lastLoginTime = {};
    
    logs.forEach(log => {
        const user = log.user;
        const timestamp = new Date(log.timestamp);
        
        if (log.action === "LOGIN") {
            lastLoginTime[user] = timestamp;
        } else if (log.action === "LOGOUT") {
            if (lastLoginTime[user]) {
                const duration = (timestamp - lastLoginTime[user]) / 1000 / 60; // Duration in minutes
                if (!result.sessionDurations[user]) {
                    result.sessionDurations[user] = [];
                }
                result.sessionDurations[user].push(Math.round(duration));
                delete lastLoginTime[user];
            }
        }
        
        // Count actions per user
        result.totalActionsPerUser[user] = (result.totalActionsPerUser[user] || 0) + 1;
        
        // Count errors per user
        if (log.action === "ERROR") {
            result.errorCount[user] = (result.errorCount[user] || 0) + 1;
        }
    });
    
    // Find most active user
    let maxActions = 0;
    for (const [user, count] of Object.entries(result.totalActionsPerUser)) {
        
        // 1. ถ้าใครไม่มีชื่อใน errorCount ให้เซตเป็น 0 ให้เขาซะ
        if (result.errorCount[user] === undefined) {
            result.errorCount[user] = 0;
        }

        // 2. ตรวจสอบหาคนที่มี Action สูงสุด
        if (count > maxActions) {
            maxActions = count;
            result.mostActiveUser = user;
        }
    }
    
    const sortedErrors = Object.entries(result.errorCount)
    .sort(([, a], [, b]) => a - b); // เรียงจากมากไปน้อย

result.errorCount = Object.fromEntries(sortedErrors);
    return result;
}

const report = processLogs(logs);
console.log(report);

/*
Expected Output:
{
    totalActionsPerUser: { Alice: 6, Bob: 8 },
    sessionDurations: { Alice: [4, 42], Bob: [25, 85] },
    errorCount: { Alice: 0, Bob: 3 },
    mostActiveUser: 'Bob'
}
*/


module.exports = processLogs;
