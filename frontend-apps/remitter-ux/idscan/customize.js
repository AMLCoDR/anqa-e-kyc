const tokenValue = "tokenKeyValue";

var journeyId;
var journeyPerson;
function onJourneyEventCallBack(event, meta, state) {
	if(state.action !== "IDENTITY:FRONT"){
		//journeyId and JourneyPerson will come after firt upload
		journeyId = state.journey.journeyId 
		journeyPerson= state.journey.person;
		console.log("journeyId", journeyId);
		console.log("journeyPerson", journeyPerson);
	}
    switch (event) {
        case 'TRANSFER:STARTED':
        case 'TRANSFER:PROGRESS': 
        case 'TRANSFER:COMPLETE': {
            if (meta.name === 'upload' && meta.status === 'complete' || meta.name === 'send' && meta.status === 'complete') {
                //console.log("TRANSFER:COMPLETE");
            }
        }
    }
};

const additionalDataDictionary = [   
    {
        name: 'Key1',
        value: 'Value2'
    }, 
    {
        name: 'Key2',
        value: 'Value2'
    }               
];

const translationDictionary = {
	'PROVIDER_TITLE_GATEWAY': 'Provide some identification',
	'PROVIDER_TITLE_LIVENESS': 'Match the identification to your face',
	'CANCEL_JOURNEY': 'Cancel',
	'PROVIDER_TITLE_RESULTS': 'Results',
	'PROVIDER_TITLE_LOGIN': 'Log in',
	'RESULTS_NEW_JOURNEY': 'Upload another ID document',
	'RESULTS_FINISH': 'Finish',
	'PROVIDER_TITLE_SMART_CAPTURE': 'Scan your identification',
	'LOGIN_SUBMIT': 'Log in'
};

const templateDictionary = {
	'none': {
		type: 'function',
		processor: 'mustache',
		provider: function() {
			return noneTemplate();
		}
	},
	'initializing': {
		type: 'function',
		processor: 'mustache',
		provider: function() {
			return initializingTemplate();
		}
	},
	'camera': {
		type: 'function',
		processor: 'mustache',
		provider: function() {
			return cameraTemplate();
		}
	},
	'cropper': {
		type: 'function',
		processor: 'mustache',
		provider: function() {
			return cropperTemplate();
		}
	},
	'filesystem': {
		type: 'function',
		processor: 'mustache',
		provider: function() {
			return fileSystemTemplate();
		}
	},
	'gateway': {
		type: 'function',
		processor: 'mustache',
		provider: function() {
			return gatewayTemplate();
		}
	},
	'liveness': {
		type: 'function',
		processor: 'mustache',
		provider: function() {
			return livenessTemplate();
		}
	},
	'login': {
		type: 'function',
		processor: 'mustache',
		provider: function() {
			return loginTemplate();
		}
	},
	'result': {
		type: 'function',
		processor: 'mustache',
		provider: function() {
			return resultTemplate();
		}
	},
	'scanner': {
		type: 'function',
		processor: 'mustache',
		provider: function() {
			return scannerTemplate();
		}
	},
	'view': {
		type: 'function',
		processor: 'mustache',
		provider: function() {
			return viewTemplate();
		}
	},
	'smartCapture': {
		type: 'function',
		processor: 'mustache',
		provider: function() {
			return smartCaptureTemplate();
		}
	},
	'journeySelect': {
		type: 'function',
		processor: 'mustache',
		provider: function() {
			return journeySelectTemplate();
		}
	}
};


function noneTemplate() {
	return null;
};
function initializingTemplate() {
	return `
			<h2 class="section-title">{{INITIALIZING_TITLE}}</h2>
			<p>{{INITIALIZING_DESCRIPTION}}</p>
		`;
};
function cameraTemplate() {
	return `
			<h2 class="section-title">{{PROVIDER_TITLE_CAMERA}}</h2>
			<div class="info-container">
				<p class="info-item journey-state">
					<span class="info-item__name">{{INFO_JOURNEY_STATE}}</span>
					<span data-jcs-element="info__journey__state" class="info-item__value">...</span>
				</p>
				<p class="info-item journey-action">
					<span class="info-item__name">{{INFO_JOURNEY_ACTION}}</span>
					<span data-jcs-element="info__journey__action" class="info-item__value">...</span>
				</p>
				<p class="info-item journey-action-attempt">
					<span class="info-item__name">{{INFO_JOURNEY_ACTION_ATTEMPT}}</span>
					<span data-jcs-element="info__journey__action__attempt" class="info-item__value">...</span>
				</p>
			</div>
			<form class="camera-options--container">
				<p data-jcs-element="camera__status" class="camera-status"></p>
				<select data-jcs-element="camera__select" class="camera-choices"></select>
			</form>
			<div class="camera-viewfinder--container">
				<canvas data-jcs-element="camera__viewfinder" class="camera-viewfinder"></canvas>
			</div>
			<form class="button-container">
				<input data-jcs-element="camera__capture" class="button button--primary" type="button" value="{{CAMERA_CAPTURE}}" />
			</form>
		`;
};

function cropperTemplate() {
	return `
		<h2 class="section-title">{{PROVIDER_TITLE_CROPPER}}</h2>
		<div class="info-container">
			<p class="info-item journey-state">
				<span class="info-item__name">{{INFO_JOURNEY_STATE}}</span>
				<span data-jcs-element="info__journey__state" class="info-item__value">...</span>
			</p>
			<p class="info-item journey-action">
				<span class="info-item__name">{{INFO_JOURNEY_ACTION}}</span>
				<span data-jcs-element="info__journey__action" class="info-item__value">...</span>
			</p>
			<p class="info-item journey-action-attempt">
				<span class="info-item__name">{{INFO_JOURNEY_ACTION_ATTEMPT}}</span>
				<span data-jcs-element="info__journey__action__attempt" class="info-item__value">...</span>
			</p>
		</div>
		<div class="cropper--container">
			<canvas data-jcs-element="cropper__canvas" class="cropper"></canvas>
		</div>
		<form class="button-container">
			<input data-jcs-element="cropper__retry" class="button button--secondary" type="button" value="{{CROPPER_RETRY}}" />
			<input data-jcs-element="cropper__submit" class="button button--primary" type="button" value="{{CROPPER_UPLOAD}}" />
		</form>
		<div data-jcs-element="cropper__status">
			<p data-jcs-element="cropper__status__message"></p>
		</div>
	`;
};

function fileSystemTemplate() {
	return `
			<h2 class="section-title">{{PROVIDER_TITLE_FILESYSTEM}}</h2>
			<div class="info-container">
				<p class="info-item journey-state">
					<span class="info-item__name">{{INFO_JOURNEY_STATE}}</span>
					<span data-jcs-element="info__journey__state" class="info-item__value">...</span>
				</p>
				<p class="info-item journey-action">
					<span class="info-item__name">{{INFO_JOURNEY_ACTION}}</span>
					<span data-jcs-element="info__journey__action" class="info-item__value">...</span>
				</p>
				<p class="info-item journey-action-attempt">
					<span class="info-item__name">{{INFO_JOURNEY_ACTION_ATTEMPT}}</span>
					<span data-jcs-element="info__journey__action__attempt" class="info-item__value">...</span>
				</p>
			</div>
			<form class="file-input--container">
				<input data-jcs-element="file__input" class="file-input" id="jcs__file__input" type="file" />
			</form>
			<label data-jcs-element="file__drop__box" class="file-input--alternatives" for="jcs__file__input">
				<span class="file-input--click">{{FILESYSTEM_SELECT}}</span>
				<span data-jcs-element="file__drop__label" class="file-input--drag">{{FILESYSTEM_DROP_IMAGE}}</span>
			</label>
		`;
};

function gatewayTemplate() {
	return `
		<h2 class="section-title">{{PROVIDER_TITLE_GATEWAY}}</h2>
		<form data-jcs-element="gateway__upload" class="upload-toggle--container">
			<label data-jcs-element="gateway__upload__toggle__label" class="upload-toggle--label">
				<input data-jcs-element="gateway__upload__toggle" class="upload-toggle" type="checkbox" />
				<span class="upload-toggle--text">{{GATEWAY_CAMERA}}</span>
			</label>
			<p data-jcs-element="gateway__camera__status"></p>
		</form>
		<div data-jcs-element="provider__container" class="provider-container"></div>
		<form class="button-container">
			<input data-jcs-element="cancel__journey" class="button button--secondary" type="button" value="{{CANCEL_JOURNEY}}" />
		</form>
	`;
};

function livenessTemplate() {
	return `
		<h2 class="section-title">{{PROVIDER_TITLE_LIVENESS}}</h2>
		<div class="info-container">
			<p class="info-item journey-state">
				<span class="info-item__name">{{INFO_JOURNEY_STATE}}</span>
				<span data-jcs-element="info__journey__state" class="info-item__value">...</span>
			</p>
			<p class="info-item journey-action">
				<span class="info-item__name">{{INFO_JOURNEY_ACTION}}</span>
				<span data-jcs-element="info__journey__action" class="info-item__value">...</span>
			</p>
			<p class="info-item journey-action-attempt">
				<span class="info-item__name">{{INFO_JOURNEY_ACTION_ATTEMPT}}</span>
				<span data-jcs-element="info__journey__action__attempt" class="info-item__value">...</span>
			</p>
		</div>
		<form class="camera-options--container">
			<p data-jcs-element="camera__status" class="camera-status"></p>
			<select data-jcs-element="camera__select" class="camera-choices"></select>
		</form>
		<div data-jcs-element="retina__notifications" class="camera-message--container">
			<span data-jcs-element="retina__message" class="camera-message"></span>
			<span data-jcs-element="retina__timer" class=camera-countdown""></span>
		</div>
		<div class="camera-viewfinder--container" data-fullscreen="false">
			<canvas data-jcs-element="camera__viewfinder" class="camera-viewfinder"></canvas>
		</div>
		<form class="button-container">
			<input data-jcs-element="cancel__journey" class="button button--secondary" type="button" value="{{CANCEL_JOURNEY}}" />
			<input data-jcs-element="retina__start" class="button button--primary" type="button" value="{{LIVENESS_START}}" />
		</form>
	`;
};
function loginTemplate() {
	return  `
		<h2 class="section-title">{{PROVIDER_TITLE_LOGIN}}</h2>
		<form data-jcs-element="login__form" class="login-form">
			<div class="input--container">
				<span class="input--label">{{LOGIN_USERNAME}}</span>
				<input data-jcs-element="login__username" class="input" id="login_username" type="text" />
			</div>
			<div class="input--container">
				<span class="input--label">{{LOGIN_PASSWORD}}</span>
				<input data-jcs-element="login__password" class="input" id="login_password" type="password" />
			</div>
			<div class="login-error--container">
				<p data-jcs-element="login__errors" class="login-error"></p>
			</div>
			<div class="button-container">
				<input data-jcs-element="login__submit" class="button button--primary" type="submit" value="{{LOGIN_SUBMIT}}" />
			</div>
		</form>
	`;
};


function resultTemplate() {
	return  `
		<h2 class="section-title">{{PROVIDER_TITLE_RESULTS}}</h2>
		<div class="info-container">
			{{#result}}
			<p class="info-item journey-result">
				<span class="info-item__name">{{INFO_JOURNEY_RESULT}}</span>
				<span class="info-item__value">{{result}}</span>
			</p>
			{{/result}}
			{{#referenceId}}
			<p class="info-item journey-reference">
				<span class="info-item__name">{{INFO_JOURNEY_REFERENCE}}</span>
				<span class="info-item__value">{{referenceId}}</span>
			</p>
			{{/referenceId}}
			<p class="info-item journey-id">
				<span class="info-item__name">{{INFO_JOURNEY_ID}}</span>
				<span class="info-item__value">{{journeyId}}</span>
			</p>
			<h3>{{RESULTS_DOCUMENTS}}</h3>
			<ol class="documents">
				{{#documents}}
					<li class="document" data-document="{{_type}}" data-result="{{_result}}">
						<ul class="document__details">
							<li class="info-item document-details__type">
								<span class="info-item__name">{{RESULTS_DOCUMENT_TYPE}}</span>
								<span class="info-item__value">{{type}}</span>
							</li>
							<li class="info-item document-details__result">
								<span class="info-item__name">{{RESULTS_DOCUMENT_RESULT}}</span>
								<span class="info-item__value">{{result}}</span>
							</li>
						</ul>
						<ul class="document__extracted-fields">
							{{#extractedFields}}
								<li class="info-item extracted-field" data-field="{{_name}}">
									<span class="info-item__name">{{name}}</span>
									</span class="info-item__value">{{value}}</span>
								</li>
							{{/extractedFields}}
							{{^extractedFields}}
								<li class="info-item">
									<span class="info-item__value">{{RESULTS_EXTRACTED_FIELDS_NONE}}</span>
								</li>
							{{/extractedFields}}
						</ul>
					</li>
				{{/documents}}
				{{^documents}}
					<li class="info-item">
						<span class="info-item__value">{{RESULTS_DOCUMENTS_NONE}}</span>
					</li>
				{{/documents}}
			</ol>
			<h3>{{RESULTS_DETAILS}}</h3>
			<ul>
				{{#resultDetails}}
					<li class="info-item" data-result-detail="{{_name}}">
						<span class="info-item__name">{{name}}</span>
						<span class="info-item__value">{{value}}</span>
					</li>
				{{/resultDetails}}
				{{^resultDetails}}
					<li class="info-item">
						<span class="info-item__value">{{RESULTS_DETAILS_NONE}}</span>
					</li>
				{{/resultDetails}}
			</ul>
		</div>
		<form class="button-container">
			<input data-jcs-element="result__logout" class="button button--secondary" type="button" value="{{RESULTS_LOGOUT}}" />
			<input data-jcs-element="result__journey__restart" class="button button--primary" type="button" value="{{RESULTS_NEW_JOURNEY}}" />
		</form>
	`;
};

function scannerTemplate() {
	return  `
		<h2 class="section-title">{{PROVIDER_TITLE_SCANNER}}</h2>
		<div class="info-container">
			<p class="info-item journey-state">
				<span class="info-item__name">{{INFO_JOURNEY_STATE}}</span>
				<span data-jcs-element="info__journey__state" class="info-item__value">...</span>
			</p>
			<p class="info-item journey-action">
				<span class="info-item__name">{{INFO_JOURNEY_ACTION}}</span>
				<span data-jcs-element="info__journey__action" class="info-item__value">...</span>
			</p>
			<p class="info-item journey-action-attempt">
				<span class="info-item__name">{{INFO_JOURNEY_ACTION_ATTEMPT}}</span>
				<span data-jcs-element="info__journey__action__attempt" class="info-item__value">...</span>
			</p>
		</div>
		<div data-jcs-element="scanner__box__title" class="scanner-title">{{SCANNER_TITLE_WAITING}}</div>
		<div data-jcs-element="scanner__box__subtitle" class="scanner-description">{{SCANNER_DESC_WAITING}}</div>
		<form class="button-container">
			<input data-jcs-element="scanner__action" class="button button--primary" type="button" value="" />
		</form>
	`;
};


function viewTemplate() {
	return `
		<h2 class="section-title">{{PROVIDER_TITLE_VIEW}}</h2>
		<div class="info-container">
			<p class="info-item journey-state">
				<span class="info-item__name">{{INFO_JOURNEY_STATE}}</span>
				<span data-jcs-element="info__journey__state" class="info-item__value">...</span>
			</p>
			<p class="info-item journey-action">
				<span class="info-item__name">{{INFO_JOURNEY_ACTION}}</span>
				<span data-jcs-element="info__journey__action" class="info-item__value">...</span>
			</p>
			<p class="info-item journey-action-attempt">
				<span class="info-item__name">{{INFO_JOURNEY_ACTION_ATTEMPT}}</span>
				<span data-jcs-element="info__journey__action__attempt" class="info-item__value">...</span>
			</p>
		</div>
		<div class="image-preview--container">
			<img data-jcs-element="view__preview" class="image-preview">
		</div>
		<form class="button-container">
			<input data-jcs-element="view__retry" class="button button--secondary" type="button" value="{{VIEW_RETRY}}" />
			<input data-jcs-element="view__upload" class="button button--primary" type="button" value="{{VIEW_UPLOAD}}" />
		</form>
		<div data-jcs-element="view__status">
			<p data-jcs-element="view__status__message"></p>
		</div>
	`;
};

function smartCaptureTemplate() {
	return `
		<h2 class="section-title">{{PROVIDER_TITLE_SMART_CAPTURE}}</h2>
		<div class="info-container">
			<p class="info-item journey-state">
				<span class="info-item__name">{{INFO_JOURNEY_STATE}}</span>
				<span data-jcs-element="info__journey__state" class="info-item__value">...</span>
			</p>
			<p class="info-item journey-action">
				<span class="info-item__name">{{INFO_JOURNEY_ACTION}}</span>
				<span data-jcs-element="info__journey__action" class="info-item__value">...</span>
			</p>
			<p class="info-item journey-action-attempt">
				<span class="info-item__name">{{INFO_JOURNEY_ACTION_ATTEMPT}}</span>
				<span data-jcs-element="info__journey__action__attempt" class="info-item__value">...</span>
			</p>
		</div>
		<form class="camera-options--container">
			<p data-jcs-element="camera__status" class="camera-status"></p>
			<select data-jcs-element="camera__select" class="camera-choices"></select>
		</form>
		<div class="camera-viewfinder--container">
			<canvas data-jcs-element="camera__viewfinder" class="camera-viewfinder"></canvas>
		</div>
		<div class="camera-conditions--container">
			<span data-jcs-element="camera__condition__uploading" class="camera-condition camera-condition--uploading">{{CAMERA_CONDITION_UPLOADING}}</span>
			<span data-jcs-element="camera__condition__capturing" class="camera-condition camera-condition--capturing">{{CAMERA_CONDITION_CAPTURING}}</span>
			<span data-jcs-element="camera__condition__alignment" class="camera-condition camera-condition--alignment">{{CAMERA_CONDITION_ALIGNMENT}}</span>
			<span data-jcs-element="camera__condition__blur" class="camera-condition camera-condition--blur">{{CAMERA_CONDITION_BLUR}}</span>
			<span data-jcs-element="camera__condition__glare" class="camera-condition camera-condition--glare">{{CAMERA_CONDITION_GLARE}}</span>
			<span data-jcs-element="camera__condition__low__resolution" class="camera-condition camera-condition--low-resolution">{{CAMERA_CONDITION_LOW_RESOLUTION}}</span>
		</div>
		<form class="button-container">
			<input data-jcs-element="camera__capture" class="button button--primary" type="button" value="{{CAMERA_CAPTURE}}" />
		</form>
	`;
};


function journeySelectTemplate(){
	return `
		<h2 class="section-title">{{PROVIDER_TITLE_JOURNEY_SELECT}}</h2>
		<form class="journey-select--choices">
			<select data-jcs-element="journey-select__choices" class="journey-choices"></select>
		</form>
		<form class="button-container">
			<input data-jcs-element="journey-select__continue" class="button button--primary" type="button" value="{{JOURNEY_SELECT_CONTINUE}}" />
		</form>
	`;
};
