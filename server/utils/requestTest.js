import chalk from "chalk";

export const requestTest = async (req, res) => {
    console.log(chalk.bgCyanBright('Test Endpoint Hit - Full Diagnostics Running!'));

    // Server Info
    const serverInfo = {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
        httpVersion: req.httpVersion,
        serverPort: process.env.PORT || 'Not set'
    };

    // Client IP Analysis
    const realIP = req.headers['x-real-ip'];
    const forwardedFor = req.headers['x-forwarded-for'];
    const remoteAddr = req.connection.remoteAddress || req.socket.remoteAddress;

    const clientInfo = {
        realIP: realIP || 'Missing',
        forwardedFor: forwardedFor || 'Missing',
        remoteAddress: remoteAddr || 'Missing',
        detectedClientIP: realIP || forwardedFor?.split(',')[0] || remoteAddr || 'Unknown'
    };

    // Proxy Headers Check
    const proxyHeaders = {
        'X-Real-IP': req.headers['x-real-ip'] || 'Missing',
        'X-Forwarded-For': req.headers['x-forwarded-for'] || 'Missing',
        'X-Forwarded-Proto': req.headers['x-forwarded-proto'] || 'Missing',
        'Host': req.headers['host'] || 'Missing',
        'Connection': req.headers['connection'] || 'Missing',
        'Upgrade': req.headers['upgrade'] || 'Not present (normal for HTTP)'
    };

    // Load Balancer Status
    const behindProxy = !!(req.headers['x-real-ip'] || req.headers['x-forwarded-for']);
    const loadBalancerStatus = behindProxy ? 'Behind Load Balancer' : 'Direct Connection';

    // WebSocket Capability
    const wsHeaders = req.headers.upgrade === 'websocket' &&
        req.headers.connection?.toLowerCase().includes('upgrade');
    const wsCapability = wsHeaders ? 'WebSocket Upgrade Request' : 'Regular HTTP Request';

    // Protocol Check
    const isHTTPS = req.headers['x-forwarded-proto'] === 'https';
    const protocolStatus = isHTTPS ? 'HTTPS' : 'HTTP';

    // Important Headers Summary
    const importantHeaders = {
        'User-Agent': req.headers['user-agent'] || 'Missing',
        'Accept': req.headers['accept'] || 'Missing',
        'Content-Type': req.headers['content-type'] || 'Not set',
        'Authorization': req.headers['authorization'] ? 'Present' : 'Not present'
    };

    // Health Check
    const healthStatus = {
        proxyHeadersWorking: behindProxy,
        serverResponding: true,
        timestampWorking: !!serverInfo.timestamp,
        environmentVarsAvailable: !!process.env.PORT
    };

    const overallHealth = Object.values(healthStatus).every(Boolean) ?
        'All Systems Operational' : 'Some Issues Detected';

    // Build complete response
    const response = {
        message: "Complete Server Diagnostics",
        status: overallHealth,
        server: serverInfo,
        client: clientInfo,
        loadBalancer: {
            status: loadBalancerStatus,
            behindProxy: behindProxy,
            proxyHeaders: proxyHeaders
        },
        protocol: {
            status: protocolStatus,
            isSecure: isHTTPS,
            version: `HTTP/${req.httpVersion}`
        },
        webSocket: {
            capability: wsCapability,
            upgradeSupport: !!req.headers.upgrade
        },
        headers: {
            important: importantHeaders,
            all: req.headers
        },
        health: healthStatus
    };

    // Colorful console logging
    console.log(chalk.green('=== DIAGNOSTICS REPORT ==='));
    console.log(chalk.yellow('Client IP:'), clientInfo.detectedClientIP);
    console.log(chalk.yellow('Load Balancer:'), behindProxy ? chalk.green('Active') : chalk.red('Not detected'));
    console.log(chalk.yellow('Protocol:'), protocolStatus);
    console.log(chalk.yellow('WebSocket:'), wsCapability);
    console.log(chalk.blue('Proxy Headers:'));
    Object.entries(proxyHeaders).forEach(([key, value]) => {
        const status = value.includes('Missing') ? chalk.red(value) : chalk.green(value);
        console.log(chalk.cyan(`   ${key}:`), status);
    });
    console.log(chalk.magenta('Overall Health:'), overallHealth);
    console.log(chalk.green('=== END REPORT ===\n'));

    res.status(200).json(response);
}