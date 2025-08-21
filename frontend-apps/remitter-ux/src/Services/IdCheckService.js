import axios from 'axios';

export class IdCheckService {
    constructor() {
        this.client = axios.create({
            baseURL: 'https://sydney.idscan.cloud/idscanEnterpriseSVC',
        });
    }

    getHeaders() {
        return {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'EuLh-fUWjklL5zomhW2LkYBasA2gCNxdt_NqMvGTeGq9u5u5KyuX9IDJ9nc-x5VHOhdH5YBMkCyIEUrCwwZh4hq9MoC3WcmIyrvBIjOpDJRKs3sV5QDVPlbXeyuXhmLvOV1bFlC8qvmBz2u2KBEiPiWMS5GCmb3_aePcsznzZGqW5EZSVesl1sK9r5OE0EnpgG11woCJUVF7HwBBwtwtD0MpRAjv5-Wc282Zm_31ZDW6w-okemRunEP0Gy_d1FPXrkdyq8sgCSAepK-r7p6YHhEX41xkFeyegb3Tl8d1KBDBxQy7UbIsWTddOonIlEZzRbopxD8_U6-WBrRNGjTxF7D0XhYkooOTvkIlLfo9ndX2mvg6A4mcti7rrS8PDOm-XStgRyMwWxPg5L4pgNboryrGfZxB3joe3m-cG8SueITKhFIq84PPGx0I9sne8pSFIiwZiGnQTKDcxaFaTLwBWRy3kWbFXH-A9uFjB6pCjZLZgm91uwRl6l7wMUgj_Ga_Y39GY59DX0mClUr_jRrClBIBRPcjYC6lF7ySOIuU9msQEK-BzOHQNCO8dc9o00KP'
            }
        };
    }

    request(url, params) {
        return new Promise(
            resolve => this.client.request({ url, params })
                .then(res => resolve(res.data))
                .catch(err => resolve(err.message)),
        );
    }

    addIdDocument(props) {
        let base64Result = props.image.split(',')[1];
        let data = {
            "PersonEntryId": props.entryId,
            "AdditionalData": [
                {
                    "Name": "Platform",
                    "Value": "WJCS"
                },
                {
                    "Name": "UserName",
                    "Value": "Avid_AML_Capture"
                },
                {
                    "Name": "JourneyDefinitionId",
                    "Value": "2594db2f-0023-4f67-a90e-e8b2a78ab638"
                }
            ],
            "ExcludeOutputImagesFromResponse": true,
            "InputImages": [
                {
                    "Data": base64Result,
                    "ImageFormat": "jpeg",
                    "Name": "WhiteImage",
                    "inputFormat": 0
                }
            ],
            "IsDocumentExtracted": false,
            "Source": 2
        }

        return this.client.post('/journey/upload', JSON.stringify(data), this.getHeaders());
    }

    addSelfie(props) {
        let base64Result = props.image.split(',')[1];
        let data = {
            "PersonEntryId": props.entryId,
            "ExcludeOutputImagesFromResponse": true,
            "InputImages": [
                {
                    "Data": base64Result,
                    "ImageFormat": "jpeg",
                    "Name": "SelfiePhoto",
                    "inputFormat": 0
                }
            ],
            "IsDocumentExtracted": false,
            "Source": 2
        }

        return this.client.post('/journey/upload', JSON.stringify(data), this.getHeaders());
    }

}
