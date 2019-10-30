/* 0.1.0 ���������� �������� ����

cscript firmware.min.js <image>

<image>		- ���� � ����� � ���������.

*/

(function(wsh, undefined){// �������� ��� �� �� ������ �������
	var value, fso, image, driver, table, now, speed,
		timeout = 15 * 1000, password = 30, error = 0;
	
	fso = new ActiveXObject('Scripting.FileSystemObject'); 
	// �������� ���� � ����� ��������
	if(!error){// ���� ���� ������
		if(0 < wsh.arguments.length){// ���� ������� ��������
			value = wsh.arguments(0);
			if(value){// ���� ������
				image = fso.getAbsolutePathName(value);
			};
		};
	};
	// ��������� ������� ����� ��������
	if(!error && image){// ���� ����� ���������
		if(fso.fileExists(image)){// ���� ���� ����������
		}else error = 1;
	};
	// ������ ������ ��� �������������� � ������
	if(!error){// ���� ���� ������
		try{// ������� ������������ � �����
			driver = new ActiveXObject('Addin.DrvFR');
		}catch(e){error = 2;};
	};
	if(!error){// ���� ���� ������
		speed = driver.BaudRate;
		driver.Password = password;
		driver.GetECRStatus();
		if(!driver.ResultCode){// ���� ������ ��������
			value = driver.ECRMode;
			if(4 == value){// ���� ����� �������
			}else error = 3;
		}else error = 3;
	};
	// ��������� ������� ����� ������
	if(!error){// ���� ���� ������
		driver.TableNumber = 14;// Sdcard status
		driver.RowNumber = 1;// First
		driver.FieldNumber = 1;// Status
		driver.GetFieldStruct();// ����������� ���������
		if(!driver.ResultCode){// ���� ������ ��������
			driver.ReadTable();// ����������� ������
			if(!driver.ResultCode){// ���� ������ ��������
				if(driver.FieldType) value = driver.ValueOfFieldString;
				else value = driver.ValueOfFieldInteger;
				if(0 == value){// ���� ��� ������� � ������ ������
				}else error = 4;
			}else error = 4;
		}else error = 4;
	};
	// ��������� ��� �������� �������
	if(!error){// ���� ���� ������
		table = {};// ���������� �������� �������
		// �������� � ������� �������
		for(var i = 1; !driver.ResultCode; i++){
			driver.TableNumber = i;
			driver.GetTableStruct();
			// �������� � ������ � ������ � ���
			table[i] = {};// ���������� �������
			for(var j = 1, jLen = driver.RowNumber; !driver.ResultCode && j <= jLen; j++){
				table[i][j] = {};// ���������� ���
				for(var k = 1, kLen = driver.FieldNumber; !driver.ResultCode && k <= kLen; k++){
					driver.TableNumber = i;// �������
					driver.RowNumber = j;// ���
					driver.FieldNumber = k;// ����
					driver.GetFieldStruct();
					if(!driver.ResultCode){// ���� ������ ��������
						driver.ReadTable();// �������� ������
						if(!driver.ResultCode){// ���� ������ ��������
							if(!driver.FieldType || 1 != driver.MAXValueOfField){
								if(driver.FieldType) value = driver.ValueOfFieldString;
								else value = driver.ValueOfFieldInteger;
								// ������ ���� �������������
								if(17 == i && 1 == j &&  3 == k) value = 2;// ����� ���������� ������
								if(17 == i && 1 == j && 10 == k) value = 1;// ������ ���������� ��� � �����
								if(17 == i && 1 == j && 11 == k) value = 7;// ��������� �� ���
								if(17 == i && 1 == j && 12 == k) value = 7;// ������ ���������� ������������
								if(17 == i && 1 == j && 17 == k) value = 2;// ������ ��
								if(17 == i && 1 == j && 39 == k) value = 1;// ����� ��������� ����������
								if(23 == i && 1 == j &&  1 == k) value = 1;// �������� � �������� ���
								if(23 == i && 1 == j &&  5 == k) value = 1;// ��������� ��������������
								if(23 == i && 1 == j &&  6 == k) value = 1;// ����������� ����������
								// ���������� ��������
								table[i][j][k] = value;
							};
						};
					};
				};
			};
		};
		if(93 == driver.ResultCode){// ���� ������ ��������
		}else error = 5;
	};
	// ��������� ������ ����������
	if(!error){// ���� ���� ������
		value = 0;// �������� � �������� ����
		driver.TableNumber = 23;// A����������������
		driver.RowNumber = 1;// First
		driver.FieldNumber = 1;// �������� � �������� ����
		driver.GetFieldStruct();// ����������� ���������
		if(!driver.ResultCode){// ���� ������ ��������
			if(driver.FieldType) driver.ValueOfFieldString = value;
			else driver.ValueOfFieldInteger = value;
			driver.WriteTable();// �������� ������
			if(!driver.ResultCode){// ���� ������ ��������
			}else error = 6;
		}else error = 6;
	};
	// ��������� �������� �� ����� ������
	if(!error){// ���� ���� ������
		driver.FileType = 1;// ��������
		driver.FileName = image;
		driver.LoadFileOnSDCard();
		if(!driver.ResultCode){// ���� ������ ��������
		}else error = 7;
	};
	// ������������� �����
	if(!error){// ���� ���� ������
		driver.RebootKKT();
		if(!driver.ResultCode){// ���� ������ ��������
		}else error = 8;
	};
	// ���������� ����� � ���
	if(!error){// ���� ���� ������
		driver.Password = password;
		driver.ConnectionTimeout = timeout;
		// ������� ����������� �����
		driver.WaitConnection();
		for(var i = 0, iLen = 5; driver.ResultCode && i < iLen; i++){
			driver.WaitConnection();
			wsh.sleep(timeout);
		};
		// ���������� �������� �����
		for(var i = 0, iLen = 7; driver.ResultCode && i < iLen; i++){
			driver.BaudRate = i;
			driver.WaitConnection();
		};
		if(!driver.ResultCode){// ���� ������ ��������
		}else error = 9;
	};
	// ��������� ����� ������
	if(!error){// ���� ���� ������
		driver.GetECRStatus();
		if(!driver.ResultCode){// ���� ������ ��������
			value = driver.ECRMode;
			if(9 == value){// ���� ����� ���������
			}else error = 10;
		}else error = 10;
	};
	// ��������� ��������������� ���������
	if(!error){// ���� ���� ������
		driver.ResetSettings();
		if(!driver.ResultCode){// ���� ������ ��������
		}else error = 11;
	};
	// ������������� ����� � ����������
	if(!error){// ���� ���� ������
		now = new Date();
		value = [// ������� �����
			9 < now.getHours() ? now.getHours() : '0' + now.getHours(),
			9 < now.getMinutes() ? now.getMinutes() : '0' + now.getMinutes(),
			9 < now.getSeconds() ? now.getSeconds() : '0' + now.getSeconds()
		].join(':');
		driver.Time = value;
		driver.SetTime();
		if(!driver.ResultCode){// ���� ������ ��������
		}else error = 12;
	};
	// ������������� ���� � ����������
	if(!error){// ���� ���� ������
		value = [// ������� �����
			9 < now.getDate() ? now.getDate() : '0' + now.getDate(),
			8 < now.getMonth() ? now.getMonth() + 1 : '0' + (now.getMonth() + 1),
			now.getFullYear()
		].join('.');
		driver.Date = value;
		driver.SetDate();
		if(!driver.ResultCode){// ���� ������ ��������
			driver.ConfirmDate();
			if(!driver.ResultCode){// ���� ������ ��������
			}else error = 13;
		}else error = 13;
	};
	// �������������� �������
	if(!error){// ���� ���� ������
		driver.InitTable();
		if(!driver.ResultCode){// ���� ������ ��������
		}else error = 14;
	};
	// ��������������� �������� ������
	if(!error){// ���� ���� ������
		for(var i in table){// �������
			for(var j in table[i]){// ����
				for(var k in table[i][j]){// ����
					value = table[i][j][k];
					driver.TableNumber = i;
					driver.RowNumber = j;
					driver.FieldNumber = k;
					driver.GetFieldStruct();// ����������� ���������
					if(!driver.ResultCode){// ���� ������ ��������
						if(driver.FieldType) driver.ValueOfFieldString = value;
						else driver.ValueOfFieldInteger = value;
						driver.WriteTable();// �������� ������
					};
				};
			};
		};
	};
	// ��������� � �������� ��������
	if(!error){// ���� ���� ������
		driver.GetExchangeParam();
		if(!driver.ResultCode){// ���� ������ ��������
			value = driver.BaudRate;
			if(value != speed){// ���� ����� ��������
				driver.BaudRate = speed;
				driver.SetExchangeParam();
				if(!driver.ResultCode){// ���� ������ ��������
				}else error = 15;
			};
		}else error = 15;
	};
	// ������������� �����
	if(!error){// ���� ���� ������
		driver.RebootKKT();
		if(!driver.ResultCode){// ���� ������ ��������
		}else error = 16;
	};
	// ��������� �������� �����
	wsh.quit(error);
})(WSH);