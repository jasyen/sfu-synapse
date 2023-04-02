const db = require('../db/connection.db').pool
const nodemailer = require('nodemailer')

// POST /auth
const SendVerificationEmail = async (req, res) => {
    console.log('Received request: SendVerificationEmail')

    
    const email = req.body.email
    const code = authCode()
    let time = new Date()
    const expires = new Date(time.setMinutes(time.getMinutes() + 10))
    const datetime = expires.toISOString().slice(0, 19).replace('T', ' ')
    console.log(email, code, datetime)

    try {
        // 1. check if email has been registered by another user
        const promise1 = new Promise((resolve, reject) => {
            const queryEmail = 'SELECT COUNT(*) AS count FROM Users WHERE email=?'
    
            db.query(queryEmail, [email], (err, data) => {
                if(err) return reject(err)
                console.log(data)
                console.log('Users with same email: ' + data[0].count)
                if(data[0].count > 0) {
                    return resolve(false)
                }else {
                    return resolve(true)
                }
            })
        })
    
        const uniqueEmail = await promise1
        if(!uniqueEmail) {
            return res.status(400).json(`Account registered with <${email}> already exists! Please log in.`)
        }


        // 2. Record email, code, and expiration
        const promise2 = new Promise((resolve, reject) => {
            const queryCode = 'INSERT INTO AuthCodes (email, code, expires) VALUES (?, ?, ?)'
            db.query(queryCode, [email, code, datetime], (err) => {
                if(err) return reject(err)
                return resolve()
            })
        })

        await promise2


        // 3. Send verification code via email
        var transport = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "sfusynapse@gmail.com",
                pass: "zsgqshvvsldtfjrn"
            }
        })
    
        var mailOptions = {
            from: 'sfusynapse@gmail.com',
            to: req.body.email,
            subject: 'Welcome to SFU Synapse! Email Verification Code',
            text: 'Your email verification code is: ' + code,
            html: `<!DOCTYPE html>
            <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width,initial-scale=1">
              <meta name="x-apple-disable-message-reformatting">
              <title></title>
              <!--[if mso]>
              <noscript>
                <xml>
                  <o:OfficeDocumentSettings>
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                  </o:OfficeDocumentSettings>
                </xml>
              </noscript>
              <![endif]-->
              <style>
                table, td, div, h1, p {font-family: Arial, sans-serif;}
              </style>
            </head>
            <body style="margin:0;padding:0;">
              <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;">
                <tr>
                  <td align="center" style="padding:0;">
                    <table role="presentation" style="width:602px;border-collapse:collapse;border:1px solid #cccccc;border-spacing:0;text-align:left;">
                      <tr>
                        <td align="center" style="padding:40px 0 30px 0;background:#11515D;">
                            <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 400 300" width="406" height="306" class="illustration styles_illustrationTablet__1DWOa"><defs><linearGradient id="linear-gradient" x1="154.39" y1="241.04" x2="168.05" y2="226.73" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff" stop-opacity="0"></stop><stop offset="1" stop-color="#ff6a00"></stop></linearGradient><linearGradient id="linear-gradient-2" x1="89.59" y1="218.43" x2="98.52" y2="208.32" xlink:href="#linear-gradient"></linearGradient><linearGradient id="linear-gradient-3" x1="231.62" y1="238.1" x2="268.56" y2="217.95" xlink:href="#linear-gradient"></linearGradient></defs><title>61-70</title><polygon points="55.47 202.69 192.47 119.69 340.47 202.69 205.47 281.69 55.47 202.69" fill="#ffa71f"></polygon><path d="M215.85,219.28c-6.92-3.63-45.06-6.69-51.43-11.22-1.37-1,3-4.73,2.91-6.08L124.91,229.3l37.5,20.49Z" opacity="0.32" fill="url(#linear-gradient)"></path><path d="M108.2,197.82a4.93,4.93,0,0,1-2.14-3.63L76.39,213.24l19.07,10.52h0c.08-.36,23.54-18.5,23.54-18.5C112.08,201.63,114.56,202.35,108.2,197.82Z" opacity="0.32" fill="url(#linear-gradient-2)"></path><path d="M293.86,207.67a.67.67,0,0,1,0-.73c.14-.25-3.62-1-3.48-1.26.18-.62-2.24-.75-2.07-1.37-6.34-2.81-7.64-3.78-12.46-8.44l-47.35,30.4,26.82,17,36.24-22.37C291.66,220.43,301.54,216.14,293.86,207.67Z" opacity="0.32" fill="url(#linear-gradient-3)"></path><path d="M200.24,77.35q-24,12.11-47.05,25.83a.5.5,0,0,0,.5.86q23.08-13.71,47.05-25.83C201.32,77.92,200.82,77.06,200.24,77.35Z" fill="#f7931e"></path><path d="M193.06,85.92a5.56,5.56,0,0,0-4.69,6.19c.08.63,1.08.64,1,0A4.58,4.58,0,0,1,192.68,87a20.42,20.42,0,0,1-1.81,8.1c-.26.58.6,1.09.86.5a21.68,21.68,0,0,0,2-9.24A.51.51,0,0,0,193.06,85.92Z" fill="#f7931e"></path><path d="M192.31,97c-.35-.54-1.21,0-.86.5a1,1,0,0,1-1.59,1.17c-.42-.49-1.12.22-.71.71A2,2,0,0,0,192.31,97Z" fill="#f7931e"></path><path d="M156.69,206.7l40-23.26a2.63,2.63,0,0,1,2.6,0l22.84,12.73a2,2,0,0,1,0,3.48l-15.44,9.07a1.38,1.38,0,0,0,.05,2.41l9,4.78a1.94,1.94,0,0,1,0,3.4l-21.42,12.17a3.56,3.56,0,0,1-3.6,0l-34.17-20.64A2.36,2.36,0,0,1,156.69,206.7Z" fill="#3c6071"></path><path d="M155.52,208.51c.06-.28,0-8.18,0-8.18l7.85,4.09Z" fill="#3c6071"></path><polygon points="216.82 217.47 216.82 209.32 209.65 213.79 216.82 217.47" fill="#3c6071"></polygon><polygon points="223.16 197.56 223.16 189.57 215.41 193.86 218.38 196.53 223.16 197.56" fill="#3c6071"></polygon><path d="M156.69,198.54l40-23.26a2.63,2.63,0,0,1,2.6,0L222.13,188a2,2,0,0,1,0,3.48l-15.44,9.07a1.38,1.38,0,0,0,.05,2.41l9,4.78a1.94,1.94,0,0,1,0,3.4l-21.42,12.17a3.56,3.56,0,0,1-3.6,0l-34.17-20.64A2.36,2.36,0,0,1,156.69,198.54Z" fill="#4d7c8e"></path><path d="M183.25,199.56l1.63,1-5.26,2.92-8.35-5.46,5.06-2.82,1.63,1-3.59,2,1.68,1.09,2.82-1.57,1.62,1-2.83,1.57,1.86,1.21Z" fill="#fff"></path><path d="M182.1,195.93a1.63,1.63,0,0,1-.07-.24,1.16,1.16,0,0,1,.61-1.07,3.31,3.31,0,0,1,2.06-.31,6,6,0,0,1,2.44.91l3.49,2.19-1.35.75L186,196.08a2.67,2.67,0,0,0-1.15-.41,1.67,1.67,0,0,0-1,.17q-.45.25-.36.63a1.59,1.59,0,0,0,.77.81l3.09,2L186,200,180,196.21l1.33-.74Z" fill="#fff"></path><path d="M184.73,191.49l1.18-.66,1.91,1.18,1-.55,1.48.92-1,.55,2.4,1.49a1.43,1.43,0,0,0,.65.2,1.08,1.08,0,0,0,.62-.11,1,1,0,0,0,.22-.16.59.59,0,0,0,.12-.15l0,0,1.42.88a1.9,1.9,0,0,1-.72.61q-1.55.86-3.64-.44L188,193.68l-.84.47-1.47-.92.44-.25a.29.29,0,0,0,.16-.35.87.87,0,0,0-.42-.45Z" fill="#fff"></path><path d="M194.19,192.52a3.21,3.21,0,0,0,1.26.28,2.33,2.33,0,0,0,1.21-.28,1.18,1.18,0,0,0,.52-.5.69.69,0,0,0,.08-.48l0-.19,1.82.29,0,.12a1.37,1.37,0,0,1,0,.3,1.53,1.53,0,0,1-.1.43,1.57,1.57,0,0,1-.33.48,2.57,2.57,0,0,1-.63.48,4.79,4.79,0,0,1-2.77.45,6.71,6.71,0,0,1-3-.95,2.84,2.84,0,0,1-1.48-1.79,1.4,1.4,0,0,1,.85-1.56,4.42,4.42,0,0,1,2.6-.43,6.67,6.67,0,0,1,2.88.94l.63.44Zm-1.56-1.45a1.11,1.11,0,0,0,.39.73l2.24-1.24a3.22,3.22,0,0,0-1.17-.28,1.9,1.9,0,0,0-1,.21A.66.66,0,0,0,192.63,191.07Z" fill="#fff"></path><path d="M199.7,187.14a2.11,2.11,0,0,0-.51.21q-.53.29-.41.72t.91.9l2.95,1.77-1.35.75-6.14-3.7,1.33-.74.75.45q0-.08-.06-.23a1,1,0,0,1,.1-.48,1.12,1.12,0,0,1,.53-.56l.2-.11Z" fill="#fff"></path><path d="M114.13,101s2.1-3.75,2.68-4.08a6,6,0,0,1,2.46-1c.51.12,0,1.42,0,1.42s5-1.28,5.51-.9-.51,2.13-1.45,3.18-7.56,4.28-7.56,4.28Z" fill="#ffb7a2"></path><path d="M124.22,96.92l3.39-6a.42.42,0,0,0-.52-.59l-4.67,1.91a1.61,1.61,0,0,0-.79.7l-3.15,5.57,0,0C120.37,97.84,122.32,97.47,124.22,96.92Z" fill="#42342d"></path><path d="M108.17,61.83s-6.08-.6-9.25,4.15S88.29,88.27,90.21,89.74s12.33,3.17,17.42,1.7,4.86-13.35,4.86-13.35" fill="#42342d"></path><path d="M110,184.28s-.33,9,1.32,11.74,9.87,7.32,7.7,9.25-7.29,1-9-1.16a42.66,42.66,0,0,1-3-4.65l0,3.41s-3.42-2-3.42-2.17-.79-20.34-.79-20.34" fill="#42342d"></path><path d="M97.53,188.07s-.33,9,1.33,11.7,10.32,8.94,8.13,10.86-7.3.15-9.42-2.48a31.07,31.07,0,0,1-3.1-4.95l0,3.4s-3.45-2-3.45-2.17-.79-20.28-.79-20.28" fill="#42342d"></path><path d="M113.85,112.16c.44,1.13,4.46,67.13.22,75.53a21.35,21.35,0,0,1-11.21,2.37L101.47,195s-10.42,3.23-17.94.09c0,0,3.6-68.74,8.92-81.48" fill="#748de8"></path><path d="M115.37,98.27q.14-2.72.23-5.45c.1-3.25.76-7.76-1.51-10.47-1.5-1.8-4-2.07-6-2.8a8,8,0,0,0-2.81-.45,9.28,9.28,0,0,0-1.84.41c-2.25,0-5.22,1.87-7.29,2.87-1,.5-1.58,3.69-2.45,4.44-1.88,4.51-2.31,4.84-2.4,9.77a1,1,0,0,0-.13.25c-.48,1.52-.22,6.87.17,11.93,0,.1,0,.2,0,.3l0-.06c.18,2.31.39,4.55.56,6.32,7,2.8,14.86,1.83,22-.43.55-.17.81-7.94.9-8.84C115,103.47,115.24,100.87,115.37,98.27Z" fill="#05c69f"></path><path d="M114.24,68c.3.16-1.14,14.26-6.81,12.94s-5.63-6-5.5-7.22,2.79-4.17,3.67-5.32S113,67.29,114.24,68Z" fill="#ffb7a2"></path><path d="M115.63,66.5c-.73-3.55-7-6.26-12.8-3.53-3.61,1.7-7.16,11.52-3.16,13.51s3,1,3,1a4.84,4.84,0,0,1-.15-.74.66.66,0,0,1-.05-.31c0-.09,0-.18,0-.26s0-.13,0-.19a12.38,12.38,0,0,1,3-7.16c1.77-1.77,4.18-1.66,6.48-1.33a7.25,7.25,0,0,1,2.23.46l-.36,3.66A4.86,4.86,0,0,0,115.63,66.5Z" fill="#42342d"></path><path d="M114.27,70.34,109,69.92V68.18L108,70l-1.53-.38s-2.6,8.06-3.81,7.88-1.74-4.16-1.28-6.24,2.95-6.09,7.11-6.11S115.22,66.53,114.27,70.34Z" fill="#42342d"></path><path d="M106.79,100.15a49.65,49.65,0,0,1-6.16,1.38c-.67,0-1.47-.17-1.7-.8a1.79,1.79,0,0,1,0-.73,67.14,67.14,0,0,1,1.06-8.39c.38-2.48.81-5.87-.42-8.19-1.84-3.44-5.45-.19-6.81,1.91-2.24,3.49-2.48,8.41-2.64,12.43-.54,13.64,2.79,14.22,7.39,14.08s18.63-3.58,18.75-5.45c.08-1.19-1-4.57-2.14-6.79C113.57,98.64,110.11,99.34,106.79,100.15Z" fill="#08b58c"></path><path d="M106.51,127.94q-1,31.14-4.3,62.14c-.07.64.93.63,1,0q3.27-31,4.3-62.14C107.53,127.3,106.53,127.3,106.51,127.94Z" fill="#fff"></path><path d="M270.44,120.11c0,.06,3.8-6.53,3.22-12.41s-8-1.65-8-1.65" fill="#ffb39c"></path><path d="M272.63,90.56s-6.36,3.05-7,17c0,0,6.67,1.3,9.56.59" fill="#11515D"></path><path d="M284.7,152s2.14,17.55,3.35,22,2.29,32.68,2.29,32.68,3.77,2.69,7,0c0,0,1.7-22.84.81-28.94s0-30.14,0-30.14" fill="#ffc6b2"></path><path d="M272.35,147s-.43,12.94,0,17.21,2.28,31.29,2.28,31.29a4.8,4.8,0,0,0,6.26,0s2.07-13.37,1.82-15.93-.68-34.85-.68-34.85" fill="#ffc6b2"></path><path d="M285.6,82.48c0,.07,15.63,14.15,10.93,19.21s-10.93-1.83-10.93-1.83l-2-16" fill="#f18f22"></path><path d="M284.7,216.84a3.67,3.67,0,0,0,.7,4.07c1.8,1.92,4.16,1,6.15,0s7.63-6,6.85-7.31-1.07-6.83-1.07-6.83" fill="#fff"></path><path d="M290.25,204.58s-.91,5.2-2.2,6.89-4.34,5.82-3.35,6.89,1.73-2.14,3.35-1.22,1.11,3.22,2.29,2.76,6.69-4.84,7.3-7.62-.77-7.68-.77-7.68" fill="#11515D"></path><path d="M265,203.08s-.22,3.1,2.59,3.69,6.3-1.12,7.87-1.84,7.31-5.55,7.31-5.55l-.68-6.75" fill="#fff"></path><path d="M274.39,192.15s-1.68,4.18-4.72,5.75-5.4,4.61-4.72,5.17,2.14-1.46,2.92-.9.78,3,1.74,2.41,3,1,5.79-.95,1.91-2.7,4.27-3.6,2.36-7.42,2.36-7.42S276.08,193.94,274.39,192.15Z" fill="#11515D"></path><path d="M271.82,123.47a47.64,47.64,0,0,0-2.41,13c-.44,7.84,2.75,53.71,2.75,53.71a24.49,24.49,0,0,0,14.62.77v10.48s8.07,2.62,16.89-3c0,0-1.41-65.85-11-74.08" fill="#f15a24"></path><path d="M293.35,95.59c-1.28-4.49-8.5-6.09-16.68-5.86a10.09,10.09,0,0,0-4,.84c-2.85,4.13-2.22,9.78-1.78,14.52.49,5.33.58,14.83,1,18.38,7.35,3.8,18.88,1.29,20.86.87C292.67,124.34,294.64,100.08,293.35,95.59Z" fill="#11515D"></path><path d="M282.28,86.34l.41,4.23s-2.89,1.79-5.43.58l-.35-2.65" fill="#ffb39c"></path><path d="M276,85.1c-6.61.77-6.09-4.58-6.09-4.58-1.06-11.16,10.87-9,10.87-9s9,2.11,3.43,13.27" fill="#f18f22"></path><path d="M271.14,76.56s.49,13.77,6.16,13.12,5.35-5.35,5.35-5.35.81-8.59-3.89-10.21S271.14,76.56,271.14,76.56Z" fill="#ffc6b2"></path><path d="M271.14,76.56s3.28,4.91,7.36,4.55,3.78,5.23,3.78,5.23a7.51,7.51,0,0,0,3.85-7.11c0-3-4.25-8-8.18-7.76S270.23,73.77,271.14,76.56Z" fill="#f18f22"></path><path d="M288.47,127.37a18.17,18.17,0,0,0,5,1.09,30.59,30.59,0,0,0,.83-4.78s9.65-8.4,8.56-12.78-9.46-16.24-9.57-16.22c-3.49.44-4.75,8-4.13,9.41s5,5.42,4.93,7.57S289.91,121,289.64,122s-5.54,2.52-4.94,3.75c.77,1.59,4.35-.26,4.35-.26S288.79,126.31,288.47,127.37Z" fill="#ffc6b2"></path><path d="M291.11,92.4a43.12,43.12,0,0,1,8.28,10.14s-3.89,5.21-7.84,6.47,0-.59,0-.59-4-2.78-4.71-5.24S291.11,92.4,291.11,92.4Z" fill="#11515D"></path><path d="M260.59,96.92a.7.7,0,0,1,1.06-.75c1.82,1.2,4.56,3,4.53,3s2.27,8.54,2.27,8.54l-6.11-3.62Z" fill="#842e13"></path><path d="M266.3,109.45s3-1.56,3.1-2.76-1.52-3.54-2.3-3.95-3.92,1.84-3.92,1.84l-1.5-3.19a4.65,4.65,0,0,0-.49,2.13c.1,1,.49,8.07,1.56,9s4.19.78,4.38,0S266.3,109.45,266.3,109.45Z" fill="#ffc6b2"></path><path d="M262,110.66s1.68,9.35,3.64,10.68a3.44,3.44,0,0,0,5.16-3.67c-.55-3.67-4.38-9.27-4.38-9.27" fill="#ffc6b2"></path><path d="M283.2,139.77c-.07-.63-1.07-.64-1,0q2.8,26.36,4.41,52.82c0,.64,1,.64,1,0Q286,166.13,283.2,139.77Z" fill="#842e13"></path><path d="M248.36,57.26l-54-31a2.27,2.27,0,0,0-3.4,2v20A5.45,5.45,0,0,0,193.75,53L246.12,82.3a2.27,2.27,0,0,0,3.38-2V59.23A2.27,2.27,0,0,0,248.36,57.26Z" fill="#11515D"></path><polyline points="244.51 78.05 244.51 89.75 234.75 75.19" fill="#11515D"></polyline><line x1="198.06" y1="36.86" x2="226.72" y2="52.84" fill="#11515D"></line><path d="M197.3,38.16l28.66,16c1.69.94,3.2-1.65,1.51-2.59l-28.66-16c-1.69-.94-3.2,1.65-1.51,2.59Z" fill="#f2f2f2"></path><line x1="196.81" y1="44.85" x2="240.13" y2="69.01" fill="#11515D"></line><path d="M196.05,46.15,239.37,70.3c1.69.94,3.2-1.65,1.51-2.59L197.57,43.56c-1.69-.94-3.2,1.65-1.51,2.59Z" fill="#f2f2f2"></path><path d="M243.52,144.3l-54-31a2.27,2.27,0,0,0-3.4,2v20a5.45,5.45,0,0,0,2.79,4.76l52.37,29.31a2.27,2.27,0,0,0,3.38-2V146.27A2.27,2.27,0,0,0,243.52,144.3Z" fill="#11515D"></path><polyline points="239.67 165.09 239.67 176.79 229.91 162.24" fill="#11515D"></polyline><line x1="192.83" y1="125.27" x2="221.49" y2="141.25" fill="#11515D"></line><path d="M192.07,126.56l28.66,16c1.69.94,3.2-1.65,1.51-2.59l-28.66-16c-1.69-.94-3.2,1.65-1.51,2.59Z" fill="#f2f2f2"></path><line x1="191.58" y1="133.26" x2="234.89" y2="157.41" fill="#11515D"></line><path d="M190.82,134.55l43.32,24.16c1.69.94,3.2-1.65,1.51-2.59L192.33,132c-1.69-.94-3.2,1.65-1.51,2.59Z" fill="#f2f2f2"></path><path d="M146.36,100.9l54-31a2.27,2.27,0,0,1,3.4,2v20A5.45,5.45,0,0,1,201,96.63L148.6,125.94a2.27,2.27,0,0,1-3.38-2V102.87A2.27,2.27,0,0,1,146.36,100.9Z" fill="#05c69f"></path><polyline points="150.21 121.69 150.21 133.38 159.97 118.83" fill="#05c69f"></polyline><line x1="195.99" y1="83.41" x2="167.33" y2="99.39" fill="#11515D"></line><path d="M195.23,82.11l-28.66,16c-1.69.94-.18,3.53,1.51,2.59l28.66-16c1.69-.94.18-3.53-1.51-2.59Z" fill="#f2f2f2"></path><line x1="197.24" y1="91.4" x2="153.92" y2="115.56" fill="#11515D"></line><path d="M196.48,90.1l-43.32,24.16c-1.69.94-.18,3.53,1.51,2.59L198,92.69c1.69-.94.18-3.53-1.51-2.59Z" fill="#f2f2f2"></path></svg>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:36px 30px 42px 30px;">
                          <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
                            <tr>
                              <td style="padding:0 0 36px 0;color:#153643;">
                                <h1 style="font-size:24px;margin:0 0 24px 0;font-family:Arial,sans-serif;padding-top:16px;padding-bottom:16px;">Email Verification Code</h1>
                                <p style="margin:0 0 48px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;font-size:24px;text-align:center;"><span style="padding:12px 16px;background-color:#F0F0F0;border-radius:4px;">${code}</span></p>
                                <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">You are one step away from starting your journey with us! <br><small style="color: #ee4c50">Code expires ${new Date(expires)}</small></p>
                                <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;"><strong>Why do I need to verify my email?</strong><br>SFU Synapse is a place for SFU students to build long lasting connections. Verifying your SFU email will help us ensure that every user is a student of SFU.</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:30px;background:#F39122;">
                          <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;font-size:9px;font-family:Arial,sans-serif;">
                            <tr>
                              <td style="padding:0;width:50%;" align="left">
                                <p style="margin:0;font-size:14px;line-height:16px;font-family:Arial,sans-serif;color:#ffffff;">
                                  &copy; SFU Synapse 2023<br/>
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>`
        }
    
        transport.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
                return res.status(500).json('Failed to send email. Please check your email address and try again.')
            }
            console.log('Message sent: %s', info.messageId)
            return res.status(200).json('Email verification code sent! Please check your mailbox')
        })

    }catch(err) {
        res.status(500).json(err)
    }

}

// helper functions
function authCode() {
    var code = '';

    // append random digits
    const len = 6;
    for(let i=0; i < len; i++) {
        const num = Math.floor(Math.random() * 10)
        console.log(num)
        code += num.toString()
    }
    
    return code
}


module.exports = { SendVerificationEmail }