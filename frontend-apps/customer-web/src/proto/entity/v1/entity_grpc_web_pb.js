/**
 * @fileoverview gRPC-Web generated client stub for entity.v1
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck



const grpc = {};
grpc.web = require('grpc-web');


var google_api_annotations_pb = require('../../google/api/annotations_pb.js')
const proto = {};
proto.entity = {};
proto.entity.v1 = require('./entity_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.entity.v1.EntityServiceClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.entity.v1.EntityServicePromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.entity.v1.AddRequest,
 *   !proto.entity.v1.AddResponse>}
 */
const methodDescriptor_EntityService_Add = new grpc.web.MethodDescriptor(
  '/entity.v1.EntityService/Add',
  grpc.web.MethodType.UNARY,
  proto.entity.v1.AddRequest,
  proto.entity.v1.AddResponse,
  /**
   * @param {!proto.entity.v1.AddRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.entity.v1.AddResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.entity.v1.AddRequest,
 *   !proto.entity.v1.AddResponse>}
 */
const methodInfo_EntityService_Add = new grpc.web.AbstractClientBase.MethodInfo(
  proto.entity.v1.AddResponse,
  /**
   * @param {!proto.entity.v1.AddRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.entity.v1.AddResponse.deserializeBinary
);


/**
 * @param {!proto.entity.v1.AddRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.entity.v1.AddResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.entity.v1.AddResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.entity.v1.EntityServiceClient.prototype.add =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/entity.v1.EntityService/Add',
      request,
      metadata || {},
      methodDescriptor_EntityService_Add,
      callback);
};


/**
 * @param {!proto.entity.v1.AddRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.entity.v1.AddResponse>}
 *     Promise that resolves to the response
 */
proto.entity.v1.EntityServicePromiseClient.prototype.add =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/entity.v1.EntityService/Add',
      request,
      metadata || {},
      methodDescriptor_EntityService_Add);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.entity.v1.QueryRequest,
 *   !proto.entity.v1.QueryResponse>}
 */
const methodDescriptor_EntityService_Query = new grpc.web.MethodDescriptor(
  '/entity.v1.EntityService/Query',
  grpc.web.MethodType.UNARY,
  proto.entity.v1.QueryRequest,
  proto.entity.v1.QueryResponse,
  /**
   * @param {!proto.entity.v1.QueryRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.entity.v1.QueryResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.entity.v1.QueryRequest,
 *   !proto.entity.v1.QueryResponse>}
 */
const methodInfo_EntityService_Query = new grpc.web.AbstractClientBase.MethodInfo(
  proto.entity.v1.QueryResponse,
  /**
   * @param {!proto.entity.v1.QueryRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.entity.v1.QueryResponse.deserializeBinary
);


/**
 * @param {!proto.entity.v1.QueryRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.entity.v1.QueryResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.entity.v1.QueryResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.entity.v1.EntityServiceClient.prototype.query =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/entity.v1.EntityService/Query',
      request,
      metadata || {},
      methodDescriptor_EntityService_Query,
      callback);
};


/**
 * @param {!proto.entity.v1.QueryRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.entity.v1.QueryResponse>}
 *     Promise that resolves to the response
 */
proto.entity.v1.EntityServicePromiseClient.prototype.query =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/entity.v1.EntityService/Query',
      request,
      metadata || {},
      methodDescriptor_EntityService_Query);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.entity.v1.GetRequest,
 *   !proto.entity.v1.GetResponse>}
 */
const methodDescriptor_EntityService_Get = new grpc.web.MethodDescriptor(
  '/entity.v1.EntityService/Get',
  grpc.web.MethodType.UNARY,
  proto.entity.v1.GetRequest,
  proto.entity.v1.GetResponse,
  /**
   * @param {!proto.entity.v1.GetRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.entity.v1.GetResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.entity.v1.GetRequest,
 *   !proto.entity.v1.GetResponse>}
 */
const methodInfo_EntityService_Get = new grpc.web.AbstractClientBase.MethodInfo(
  proto.entity.v1.GetResponse,
  /**
   * @param {!proto.entity.v1.GetRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.entity.v1.GetResponse.deserializeBinary
);


/**
 * @param {!proto.entity.v1.GetRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.entity.v1.GetResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.entity.v1.GetResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.entity.v1.EntityServiceClient.prototype.get =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/entity.v1.EntityService/Get',
      request,
      metadata || {},
      methodDescriptor_EntityService_Get,
      callback);
};


/**
 * @param {!proto.entity.v1.GetRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.entity.v1.GetResponse>}
 *     Promise that resolves to the response
 */
proto.entity.v1.EntityServicePromiseClient.prototype.get =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/entity.v1.EntityService/Get',
      request,
      metadata || {},
      methodDescriptor_EntityService_Get);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.entity.v1.UpdateRequest,
 *   !proto.entity.v1.UpdateResponse>}
 */
const methodDescriptor_EntityService_Update = new grpc.web.MethodDescriptor(
  '/entity.v1.EntityService/Update',
  grpc.web.MethodType.UNARY,
  proto.entity.v1.UpdateRequest,
  proto.entity.v1.UpdateResponse,
  /**
   * @param {!proto.entity.v1.UpdateRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.entity.v1.UpdateResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.entity.v1.UpdateRequest,
 *   !proto.entity.v1.UpdateResponse>}
 */
const methodInfo_EntityService_Update = new grpc.web.AbstractClientBase.MethodInfo(
  proto.entity.v1.UpdateResponse,
  /**
   * @param {!proto.entity.v1.UpdateRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.entity.v1.UpdateResponse.deserializeBinary
);


/**
 * @param {!proto.entity.v1.UpdateRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.entity.v1.UpdateResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.entity.v1.UpdateResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.entity.v1.EntityServiceClient.prototype.update =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/entity.v1.EntityService/Update',
      request,
      metadata || {},
      methodDescriptor_EntityService_Update,
      callback);
};


/**
 * @param {!proto.entity.v1.UpdateRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.entity.v1.UpdateResponse>}
 *     Promise that resolves to the response
 */
proto.entity.v1.EntityServicePromiseClient.prototype.update =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/entity.v1.EntityService/Update',
      request,
      metadata || {},
      methodDescriptor_EntityService_Update);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.entity.v1.SetRiskRequest,
 *   !proto.entity.v1.SetRiskResponse>}
 */
const methodDescriptor_EntityService_SetRisk = new grpc.web.MethodDescriptor(
  '/entity.v1.EntityService/SetRisk',
  grpc.web.MethodType.UNARY,
  proto.entity.v1.SetRiskRequest,
  proto.entity.v1.SetRiskResponse,
  /**
   * @param {!proto.entity.v1.SetRiskRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.entity.v1.SetRiskResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.entity.v1.SetRiskRequest,
 *   !proto.entity.v1.SetRiskResponse>}
 */
const methodInfo_EntityService_SetRisk = new grpc.web.AbstractClientBase.MethodInfo(
  proto.entity.v1.SetRiskResponse,
  /**
   * @param {!proto.entity.v1.SetRiskRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.entity.v1.SetRiskResponse.deserializeBinary
);


/**
 * @param {!proto.entity.v1.SetRiskRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.entity.v1.SetRiskResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.entity.v1.SetRiskResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.entity.v1.EntityServiceClient.prototype.setRisk =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/entity.v1.EntityService/SetRisk',
      request,
      metadata || {},
      methodDescriptor_EntityService_SetRisk,
      callback);
};


/**
 * @param {!proto.entity.v1.SetRiskRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.entity.v1.SetRiskResponse>}
 *     Promise that resolves to the response
 */
proto.entity.v1.EntityServicePromiseClient.prototype.setRisk =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/entity.v1.EntityService/SetRisk',
      request,
      metadata || {},
      methodDescriptor_EntityService_SetRisk);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.entity.v1.SetIdStatusRequest,
 *   !proto.entity.v1.SetIdStatusResponse>}
 */
const methodDescriptor_EntityService_SetIdStatus = new grpc.web.MethodDescriptor(
  '/entity.v1.EntityService/SetIdStatus',
  grpc.web.MethodType.UNARY,
  proto.entity.v1.SetIdStatusRequest,
  proto.entity.v1.SetIdStatusResponse,
  /**
   * @param {!proto.entity.v1.SetIdStatusRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.entity.v1.SetIdStatusResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.entity.v1.SetIdStatusRequest,
 *   !proto.entity.v1.SetIdStatusResponse>}
 */
const methodInfo_EntityService_SetIdStatus = new grpc.web.AbstractClientBase.MethodInfo(
  proto.entity.v1.SetIdStatusResponse,
  /**
   * @param {!proto.entity.v1.SetIdStatusRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.entity.v1.SetIdStatusResponse.deserializeBinary
);


/**
 * @param {!proto.entity.v1.SetIdStatusRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.entity.v1.SetIdStatusResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.entity.v1.SetIdStatusResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.entity.v1.EntityServiceClient.prototype.setIdStatus =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/entity.v1.EntityService/SetIdStatus',
      request,
      metadata || {},
      methodDescriptor_EntityService_SetIdStatus,
      callback);
};


/**
 * @param {!proto.entity.v1.SetIdStatusRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.entity.v1.SetIdStatusResponse>}
 *     Promise that resolves to the response
 */
proto.entity.v1.EntityServicePromiseClient.prototype.setIdStatus =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/entity.v1.EntityService/SetIdStatus',
      request,
      metadata || {},
      methodDescriptor_EntityService_SetIdStatus);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.entity.v1.SetEddStatusRequest,
 *   !proto.entity.v1.SetEddStatusResponse>}
 */
const methodDescriptor_EntityService_SetEddStatus = new grpc.web.MethodDescriptor(
  '/entity.v1.EntityService/SetEddStatus',
  grpc.web.MethodType.UNARY,
  proto.entity.v1.SetEddStatusRequest,
  proto.entity.v1.SetEddStatusResponse,
  /**
   * @param {!proto.entity.v1.SetEddStatusRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.entity.v1.SetEddStatusResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.entity.v1.SetEddStatusRequest,
 *   !proto.entity.v1.SetEddStatusResponse>}
 */
const methodInfo_EntityService_SetEddStatus = new grpc.web.AbstractClientBase.MethodInfo(
  proto.entity.v1.SetEddStatusResponse,
  /**
   * @param {!proto.entity.v1.SetEddStatusRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.entity.v1.SetEddStatusResponse.deserializeBinary
);


/**
 * @param {!proto.entity.v1.SetEddStatusRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.entity.v1.SetEddStatusResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.entity.v1.SetEddStatusResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.entity.v1.EntityServiceClient.prototype.setEddStatus =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/entity.v1.EntityService/SetEddStatus',
      request,
      metadata || {},
      methodDescriptor_EntityService_SetEddStatus,
      callback);
};


/**
 * @param {!proto.entity.v1.SetEddStatusRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.entity.v1.SetEddStatusResponse>}
 *     Promise that resolves to the response
 */
proto.entity.v1.EntityServicePromiseClient.prototype.setEddStatus =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/entity.v1.EntityService/SetEddStatus',
      request,
      metadata || {},
      methodDescriptor_EntityService_SetEddStatus);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.entity.v1.DeleteRequest,
 *   !proto.entity.v1.DeleteResponse>}
 */
const methodDescriptor_EntityService_Delete = new grpc.web.MethodDescriptor(
  '/entity.v1.EntityService/Delete',
  grpc.web.MethodType.UNARY,
  proto.entity.v1.DeleteRequest,
  proto.entity.v1.DeleteResponse,
  /**
   * @param {!proto.entity.v1.DeleteRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.entity.v1.DeleteResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.entity.v1.DeleteRequest,
 *   !proto.entity.v1.DeleteResponse>}
 */
const methodInfo_EntityService_Delete = new grpc.web.AbstractClientBase.MethodInfo(
  proto.entity.v1.DeleteResponse,
  /**
   * @param {!proto.entity.v1.DeleteRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.entity.v1.DeleteResponse.deserializeBinary
);


/**
 * @param {!proto.entity.v1.DeleteRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.entity.v1.DeleteResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.entity.v1.DeleteResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.entity.v1.EntityServiceClient.prototype.delete =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/entity.v1.EntityService/Delete',
      request,
      metadata || {},
      methodDescriptor_EntityService_Delete,
      callback);
};


/**
 * @param {!proto.entity.v1.DeleteRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.entity.v1.DeleteResponse>}
 *     Promise that resolves to the response
 */
proto.entity.v1.EntityServicePromiseClient.prototype.delete =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/entity.v1.EntityService/Delete',
      request,
      metadata || {},
      methodDescriptor_EntityService_Delete);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.entity.v1.LinkRequest,
 *   !proto.entity.v1.LinkResponse>}
 */
const methodDescriptor_EntityService_Link = new grpc.web.MethodDescriptor(
  '/entity.v1.EntityService/Link',
  grpc.web.MethodType.UNARY,
  proto.entity.v1.LinkRequest,
  proto.entity.v1.LinkResponse,
  /**
   * @param {!proto.entity.v1.LinkRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.entity.v1.LinkResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.entity.v1.LinkRequest,
 *   !proto.entity.v1.LinkResponse>}
 */
const methodInfo_EntityService_Link = new grpc.web.AbstractClientBase.MethodInfo(
  proto.entity.v1.LinkResponse,
  /**
   * @param {!proto.entity.v1.LinkRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.entity.v1.LinkResponse.deserializeBinary
);


/**
 * @param {!proto.entity.v1.LinkRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.entity.v1.LinkResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.entity.v1.LinkResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.entity.v1.EntityServiceClient.prototype.link =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/entity.v1.EntityService/Link',
      request,
      metadata || {},
      methodDescriptor_EntityService_Link,
      callback);
};


/**
 * @param {!proto.entity.v1.LinkRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.entity.v1.LinkResponse>}
 *     Promise that resolves to the response
 */
proto.entity.v1.EntityServicePromiseClient.prototype.link =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/entity.v1.EntityService/Link',
      request,
      metadata || {},
      methodDescriptor_EntityService_Link);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.entity.v1.UnlinkRequest,
 *   !proto.entity.v1.UnlinkResponse>}
 */
const methodDescriptor_EntityService_Unlink = new grpc.web.MethodDescriptor(
  '/entity.v1.EntityService/Unlink',
  grpc.web.MethodType.UNARY,
  proto.entity.v1.UnlinkRequest,
  proto.entity.v1.UnlinkResponse,
  /**
   * @param {!proto.entity.v1.UnlinkRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.entity.v1.UnlinkResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.entity.v1.UnlinkRequest,
 *   !proto.entity.v1.UnlinkResponse>}
 */
const methodInfo_EntityService_Unlink = new grpc.web.AbstractClientBase.MethodInfo(
  proto.entity.v1.UnlinkResponse,
  /**
   * @param {!proto.entity.v1.UnlinkRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.entity.v1.UnlinkResponse.deserializeBinary
);


/**
 * @param {!proto.entity.v1.UnlinkRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.entity.v1.UnlinkResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.entity.v1.UnlinkResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.entity.v1.EntityServiceClient.prototype.unlink =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/entity.v1.EntityService/Unlink',
      request,
      metadata || {},
      methodDescriptor_EntityService_Unlink,
      callback);
};


/**
 * @param {!proto.entity.v1.UnlinkRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.entity.v1.UnlinkResponse>}
 *     Promise that resolves to the response
 */
proto.entity.v1.EntityServicePromiseClient.prototype.unlink =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/entity.v1.EntityService/Unlink',
      request,
      metadata || {},
      methodDescriptor_EntityService_Unlink);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.entity.v1.RiskSummaryRequest,
 *   !proto.entity.v1.RiskSummaryResponse>}
 */
const methodDescriptor_EntityService_RiskSummary = new grpc.web.MethodDescriptor(
  '/entity.v1.EntityService/RiskSummary',
  grpc.web.MethodType.UNARY,
  proto.entity.v1.RiskSummaryRequest,
  proto.entity.v1.RiskSummaryResponse,
  /**
   * @param {!proto.entity.v1.RiskSummaryRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.entity.v1.RiskSummaryResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.entity.v1.RiskSummaryRequest,
 *   !proto.entity.v1.RiskSummaryResponse>}
 */
const methodInfo_EntityService_RiskSummary = new grpc.web.AbstractClientBase.MethodInfo(
  proto.entity.v1.RiskSummaryResponse,
  /**
   * @param {!proto.entity.v1.RiskSummaryRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.entity.v1.RiskSummaryResponse.deserializeBinary
);


/**
 * @param {!proto.entity.v1.RiskSummaryRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.entity.v1.RiskSummaryResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.entity.v1.RiskSummaryResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.entity.v1.EntityServiceClient.prototype.riskSummary =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/entity.v1.EntityService/RiskSummary',
      request,
      metadata || {},
      methodDescriptor_EntityService_RiskSummary,
      callback);
};


/**
 * @param {!proto.entity.v1.RiskSummaryRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.entity.v1.RiskSummaryResponse>}
 *     Promise that resolves to the response
 */
proto.entity.v1.EntityServicePromiseClient.prototype.riskSummary =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/entity.v1.EntityService/RiskSummary',
      request,
      metadata || {},
      methodDescriptor_EntityService_RiskSummary);
};


module.exports = proto.entity.v1;

