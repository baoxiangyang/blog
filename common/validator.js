/*校验字段
	data 需要校验的对象 Object
	rules 校验规则 Object, 由检验字段和 校验规则组成，只有一条规则时为Object, 多条时为Array
	例：
	{
		name: {required: true, type:'email', message: '此字段不能为空'},
		name2:[{required:true}, {type: 'email'}]
	}
	具体规则
		required 为true时，不能为空
		minLength， maxLength最小/大长度
		type: string, number, email, url, regexp(需要传pattern)
		多条不同的规则可以合成一条
*/
const emailReg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
function validator (data, rules) {
	let rulesArr = Object.keys(rules), errArr = [];
	for(let i = 0; i < rulesArr.length; i++){
		let value = data[rulesArr[i]],
			rule = rules[rulesArr[i]];
			rule = Array.isArray(rule) ? rule : [rule];
		rules:
		for(let y = 0; y < rule.length; y++){
			let yRule = rule[y];
            if(yRule.required && !value){
                errArr.push({name: rulesArr[i], message: yRule.message || '此字段不能为空'});
                continue rules;
            }
            if(!value){
				continue rules;
            }
            yRule.required && delete yRule.required;
            let ruleArr = Object.keys(yRule);
			for(let z = 0; z < ruleArr.length; z++){
				switch (ruleArr[z]) {
					case 'minLength':
						value.toString().length < yRule[ruleArr[z]] && errArr.push({name: rulesArr[i], message: yRule.message || `此字段长度不小于${yRule[ruleArr[z]]}`});
						break;
					case 'maxLength':
						value.toString().length > yRule[ruleArr[z]] && errArr.push({name: rulesArr[i], message: yRule.message || `此字段长度不大于${yRule[ruleArr[z]]}`});
						break;
					case 'type':
						switch (yRule.type) {
							case 'string':
								typeof value !== 'string' && errArr.push({name: rulesArr[i], message: yRule.message || '此字段必须为String类型'});
								break;
							case 'number':
								typeof value !== 'number' && errArr.push({name: rulesArr[i], message: yRule.message || '此字段必须为Number类型'});
								break;
							case 'email':
								!emailReg.test(value) && errArr.push({name: rulesArr[i], message: yRule.message || '错误的邮箱地址'});
								break;
							case 'regexp':
								!yRule.pattern.test(value) && errArr.push({name: rulesArr[i], message: yRule.message || '此字段不符合规则'});
								break;
							default:
								console.log(`type:${yRule.type} 此校验规则不存在`);
						}
						break;
					case "pattern":
						break;
					default:
						console.log(`${ruleArr[z]} 此校验规则不存在`);
						break;
				}
			}
		}
	}
	return (errArr.length ? errArr : null);
}
module.exports = validator;