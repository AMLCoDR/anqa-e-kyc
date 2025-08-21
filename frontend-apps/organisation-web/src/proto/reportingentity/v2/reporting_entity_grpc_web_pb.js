/**
 * @fileoverview gRPC-Web generated client stub for reportingentity.v2
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
proto.reportingentity = {};
proto.reportingentity.v2 = require('./reporting_entity_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.reportingentity.v2.ReportingEntityServiceClient =
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
proto.reportingentity.v2.ReportingEntityServicePromiseClient =
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
 *   !proto.reportingentity.v2.CreateRequest,
 *   !proto.reportingentity.v2.CreateResponse>}
 */
const methodDescriptor_ReportingEntityService_Create = new grpc.web.MethodDescriptor(
  '/reportingentity.v2.ReportingEntityService/Create',
  grpc.web.MethodType.UNARY,
  proto.reportingentity.v2.CreateRequest,
  proto.reportingentity.v2.CreateResponse,
  /**
   * @param {!proto.reportingentity.v2.CreateRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.reportingentity.v2.CreateResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.reportingentity.v2.CreateRequest,
 *   !proto.reportingentity.v2.CreateResponse>}
 */
const methodInfo_ReportingEntityService_Create = new grpc.web.AbstractClientBase.MethodInfo(
  proto.reportingentity.v2.CreateResponse,
  /**
   * @param {!proto.reportingentity.v2.CreateRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.reportingentity.v2.CreateResponse.deserializeBinary
);


/**
 * @param {!proto.reportingentity.v2.CreateRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.reportingentity.v2.CreateResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.reportingentity.v2.CreateResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.reportingentity.v2.ReportingEntityServiceClient.prototype.create =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/reportingentity.v2.ReportingEntityService/Create',
      request,
      metadata || {},
      methodDescriptor_ReportingEntityService_Create,
      callback);
};


/**
 * @param {!proto.reportingentity.v2.CreateRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.reportingentity.v2.CreateResponse>}
 *     Promise that resolves to the response
 */
proto.reportingentity.v2.ReportingEntityServicePromiseClient.prototype.create =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/reportingentity.v2.ReportingEntityService/Create',
      request,
      metadata || {},
      methodDescriptor_ReportingEntityService_Create);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.reportingentity.v2.QueryRequest,
 *   !proto.reportingentity.v2.QueryResponse>}
 */
const methodDescriptor_ReportingEntityService_Query = new grpc.web.MethodDescriptor(
  '/reportingentity.v2.ReportingEntityService/Query',
  grpc.web.MethodType.UNARY,
  proto.reportingentity.v2.QueryRequest,
  proto.reportingentity.v2.QueryResponse,
  /**
   * @param {!proto.reportingentity.v2.QueryRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.reportingentity.v2.QueryResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.reportingentity.v2.QueryRequest,
 *   !proto.reportingentity.v2.QueryResponse>}
 */
const methodInfo_ReportingEntityService_Query = new grpc.web.AbstractClientBase.MethodInfo(
  proto.reportingentity.v2.QueryResponse,
  /**
   * @param {!proto.reportingentity.v2.QueryRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.reportingentity.v2.QueryResponse.deserializeBinary
);


/**
 * @param {!proto.reportingentity.v2.QueryRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.reportingentity.v2.QueryResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.reportingentity.v2.QueryResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.reportingentity.v2.ReportingEntityServiceClient.prototype.query =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/reportingentity.v2.ReportingEntityService/Query',
      request,
      metadata || {},
      methodDescriptor_ReportingEntityService_Query,
      callback);
};


/**
 * @param {!proto.reportingentity.v2.QueryRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.reportingentity.v2.QueryResponse>}
 *     Promise that resolves to the response
 */
proto.reportingentity.v2.ReportingEntityServicePromiseClient.prototype.query =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/reportingentity.v2.ReportingEntityService/Query',
      request,
      metadata || {},
      methodDescriptor_ReportingEntityService_Query);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.reportingentity.v2.GetRequest,
 *   !proto.reportingentity.v2.GetResponse>}
 */
const methodDescriptor_ReportingEntityService_Get = new grpc.web.MethodDescriptor(
  '/reportingentity.v2.ReportingEntityService/Get',
  grpc.web.MethodType.UNARY,
  proto.reportingentity.v2.GetRequest,
  proto.reportingentity.v2.GetResponse,
  /**
   * @param {!proto.reportingentity.v2.GetRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.reportingentity.v2.GetResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.reportingentity.v2.GetRequest,
 *   !proto.reportingentity.v2.GetResponse>}
 */
const methodInfo_ReportingEntityService_Get = new grpc.web.AbstractClientBase.MethodInfo(
  proto.reportingentity.v2.GetResponse,
  /**
   * @param {!proto.reportingentity.v2.GetRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.reportingentity.v2.GetResponse.deserializeBinary
);


/**
 * @param {!proto.reportingentity.v2.GetRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.reportingentity.v2.GetResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.reportingentity.v2.GetResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.reportingentity.v2.ReportingEntityServiceClient.prototype.get =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/reportingentity.v2.ReportingEntityService/Get',
      request,
      metadata || {},
      methodDescriptor_ReportingEntityService_Get,
      callback);
};


/**
 * @param {!proto.reportingentity.v2.GetRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.reportingentity.v2.GetResponse>}
 *     Promise that resolves to the response
 */
proto.reportingentity.v2.ReportingEntityServicePromiseClient.prototype.get =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/reportingentity.v2.ReportingEntityService/Get',
      request,
      metadata || {},
      methodDescriptor_ReportingEntityService_Get);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.reportingentity.v2.UpdateRequest,
 *   !proto.reportingentity.v2.UpdateResponse>}
 */
const methodDescriptor_ReportingEntityService_Update = new grpc.web.MethodDescriptor(
  '/reportingentity.v2.ReportingEntityService/Update',
  grpc.web.MethodType.UNARY,
  proto.reportingentity.v2.UpdateRequest,
  proto.reportingentity.v2.UpdateResponse,
  /**
   * @param {!proto.reportingentity.v2.UpdateRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.reportingentity.v2.UpdateResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.reportingentity.v2.UpdateRequest,
 *   !proto.reportingentity.v2.UpdateResponse>}
 */
const methodInfo_ReportingEntityService_Update = new grpc.web.AbstractClientBase.MethodInfo(
  proto.reportingentity.v2.UpdateResponse,
  /**
   * @param {!proto.reportingentity.v2.UpdateRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.reportingentity.v2.UpdateResponse.deserializeBinary
);


/**
 * @param {!proto.reportingentity.v2.UpdateRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.reportingentity.v2.UpdateResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.reportingentity.v2.UpdateResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.reportingentity.v2.ReportingEntityServiceClient.prototype.update =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/reportingentity.v2.ReportingEntityService/Update',
      request,
      metadata || {},
      methodDescriptor_ReportingEntityService_Update,
      callback);
};


/**
 * @param {!proto.reportingentity.v2.UpdateRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.reportingentity.v2.UpdateResponse>}
 *     Promise that resolves to the response
 */
proto.reportingentity.v2.ReportingEntityServicePromiseClient.prototype.update =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/reportingentity.v2.ReportingEntityService/Update',
      request,
      metadata || {},
      methodDescriptor_ReportingEntityService_Update);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.reportingentity.v2.DeleteRequest,
 *   !proto.reportingentity.v2.DeleteResponse>}
 */
const methodDescriptor_ReportingEntityService_Delete = new grpc.web.MethodDescriptor(
  '/reportingentity.v2.ReportingEntityService/Delete',
  grpc.web.MethodType.UNARY,
  proto.reportingentity.v2.DeleteRequest,
  proto.reportingentity.v2.DeleteResponse,
  /**
   * @param {!proto.reportingentity.v2.DeleteRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.reportingentity.v2.DeleteResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.reportingentity.v2.DeleteRequest,
 *   !proto.reportingentity.v2.DeleteResponse>}
 */
const methodInfo_ReportingEntityService_Delete = new grpc.web.AbstractClientBase.MethodInfo(
  proto.reportingentity.v2.DeleteResponse,
  /**
   * @param {!proto.reportingentity.v2.DeleteRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.reportingentity.v2.DeleteResponse.deserializeBinary
);


/**
 * @param {!proto.reportingentity.v2.DeleteRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.reportingentity.v2.DeleteResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.reportingentity.v2.DeleteResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.reportingentity.v2.ReportingEntityServiceClient.prototype.delete =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/reportingentity.v2.ReportingEntityService/Delete',
      request,
      metadata || {},
      methodDescriptor_ReportingEntityService_Delete,
      callback);
};


/**
 * @param {!proto.reportingentity.v2.DeleteRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.reportingentity.v2.DeleteResponse>}
 *     Promise that resolves to the response
 */
proto.reportingentity.v2.ReportingEntityServicePromiseClient.prototype.delete =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/reportingentity.v2.ReportingEntityService/Delete',
      request,
      metadata || {},
      methodDescriptor_ReportingEntityService_Delete);
};


module.exports = proto.reportingentity.v2;

