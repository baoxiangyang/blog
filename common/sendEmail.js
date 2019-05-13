let nodemailer = require('nodemailer'),  
	transporter = nodemailer.createTransport({  
		host: 'smtp.139.com',  
		port: 465,
		secure: true,
		auth: {  
			user: 'xybao2@139.com',  
			pass: 'baozi123' 
		}	  
	}); 
function sendEmail(option){
	let mailOptions = {
		from: '"小包总"<xybao2@139.com>', //发送者
		to: option.to, //接受者
		subject: '"小包总"邮件验证码', //标题
		html: option.html //正文HTML
	};
	if(!option.to){
		throw Error('接受者不能为空');
	}
	if(option.code){
		mailOptions.html = `
			<table style="width: 960px;margin: 0 auto;border-collapse: collapse;border-spacing: 0;font-size: 14px;line-height: 24px;color: #333; background-color: #fff;font-family: Microsoft YaHei;">
      		<tbody>
      			<tr>
	          		<td style="padding: 20px 72px 0;"><img src="javascript:;"></td>
	      		</tr>
      			<tr>
			        <td style="padding: 20px 72px 0;">您好！</td>
			    </tr>
			    <tr>
			        <td style="padding: 20px 72px 0;">为确保是您本人操作，您已选择通过该邮件地址获取验证码验证身份。请在邮件验证码输入框输入下方验证码：</td>
			    </tr>
			    <tr>
			        <td style="padding: 20px 72px 0;">
			        	<span style="border-bottom:1px dashed #ccc;z-index:1;font-size: 30px;font-weight: bold;" onclick="return false;">${option.code}</span>
			        </td>
			    </tr>
			    <tr>
			        <td style="padding: 20px 72px 0;">勿向任何人泄露您收到的验证码。验证码会在邮件发送30分或重新获取验证码后失效。</td>
			    </tr>
			    <tr>
					<td style="padding: 20px 72px 117px;">此致<br><a href="https://www.xiaobaozong.cn">小包总的博客</a></td>
			    </tr>
			</tbody>
			</table>`;
	}
	return new Promise((resolve, reject) => {
		transporter.sendMail(mailOptions, function (err, info) {  
			transporter.close();
			if (err) {  
				reject(err);  
				return;  
			}  
			resolve(info);
		}); 
	});
}
module.exports = sendEmail;