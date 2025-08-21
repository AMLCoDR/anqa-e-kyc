/**
 * @fileoverview gRPC-Web generated client stub for customer.v1beta1
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
proto.customer = {};
proto.customer.v1beta1 = require('./customer_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.customer.v1beta1.CustomerServiceClient =
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
proto.customer.v1beta1.CustomerServicePromiseClient =
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
 *   !proto.customer.v1beta1.AddRequest,
 *   !proto.customer.v1beta1.AddResponse>}
 */
const methodDescriptor_CustomerService_Add = new grpc.web.MethodDescriptor(
  '/customer.v1beta1.CustomerService/Add',
  grpc.web.MethodType.UNARY,
  proto.customer.v1beta1.AddRequest,
  proto.customer.v1beta1.AddResponse,
  /**
   * @param {!proto.customer.v1beta1.AddRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.customer.v1beta1.AddResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.customer.v1beta1.AddRequest,
 *   !proto.customer.v1beta1.AddResponse>}
 */
const methodInfo_CustomerService_Add = new grpc.web.AbstractClientBase.MethodInfo(
  proto.customer.v1beta1.AddResponse,
  /**
   * @param {!proto.customer.v1beta1.AddRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.customer.v1beta1.AddResponse.deserializeBinary
);


/**
 * @param {!proto.customer.v1beta1.AddRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.customer.v1beta1.AddResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.customer.v1beta1.AddResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.customer.v1beta1.CustomerServiceClient.prototype.add =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/customer.v1beta1.CustomerService/Add',
      request,
      metadata || {},
      methodDescriptor_CustomerService_Add,
      callback);
};


/**
 * @param {!proto.customer.v1beta1.AddRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.customer.v1beta1.AddResponse>}
 *     Promise that resolves to the response
 */
proto.customer.v1beta1.CustomerServicePromiseClient.prototype.add =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/customer.v1beta1.CustomerService/Add',
      request,
      metadata || {},
      methodDescriptor_CustomerService_Add);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.customer.v1beta1.QueryRequest,
 *   !proto.customer.v1beta1.QueryResponse>}
 */
const methodDescriptor_CustomerService_Query = new grpc.web.MethodDescriptor(
  '/customer.v1beta1.CustomerService/Query',
  grpc.web.MethodType.UNARY,
  proto.customer.v1beta1.QueryRequest,
  proto.customer.v1beta1.QueryResponse,
  /**
   * @param {!proto.customer.v1beta1.QueryRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.customer.v1beta1.QueryResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.customer.v1beta1.QueryRequest,
 *   !proto.customer.v1beta1.QueryResponse>}
 */
const methodInfo_CustomerService_Query = new grpc.web.AbstractClientBase.MethodInfo(
  proto.customer.v1beta1.QueryResponse,
  /**
   * @param {!proto.customer.v1beta1.QueryRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.customer.v1beta1.QueryResponse.deserializeBinary
);


/**
 * @param {!proto.customer.v1beta1.QueryRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.customer.v1beta1.QueryResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.customer.v1beta1.QueryResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.customer.v1beta1.CustomerServiceClient.prototype.query =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/customer.v1beta1.CustomerService/Query',
      request,
      metadata || {},
      methodDescriptor_CustomerService_Query,
      callback);
};


/**
 * @param {!proto.customer.v1beta1.QueryRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.customer.v1beta1.QueryResponse>}
 *     Promise that resolves to the response
 */
proto.customer.v1beta1.CustomerServicePromiseClient.prototype.query =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/customer.v1beta1.CustomerService/Query',
      request,
      metadata || {},
      methodDescriptor_CustomerService_Query);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.customer.v1beta1.GetRequest,
 *   !proto.customer.v1beta1.GetResponse>}
 */
const methodDescriptor_CustomerService_Get = new grpc.web.MethodDescriptor(
  '/customer.v1beta1.CustomerService/Get',
  grpc.web.MethodType.UNARY,
  proto.customer.v1beta1.GetRequest,
  proto.customer.v1beta1.GetResponse,
  /**
   * @param {!proto.customer.v1beta1.GetRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.customer.v1beta1.GetResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.customer.v1beta1.GetRequest,
 *   !proto.customer.v1beta1.GetResponse>}
 */
const methodInfo_CustomerService_Get = new grpc.web.AbstractClientBase.MethodInfo(
  proto.customer.v1beta1.GetResponse,
  /**
   * @param {!proto.customer.v1beta1.GetRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.customer.v1beta1.GetResponse.deserializeBinary
);


/**
 * @param {!proto.customer.v1beta1.GetRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.customer.v1beta1.GetResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.customer.v1beta1.GetResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.customer.v1beta1.CustomerServiceClient.prototype.get =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/customer.v1beta1.CustomerService/Get',
      request,
      metadata || {},
      methodDescriptor_CustomerService_Get,
      callback);
};


/**
 * @param {!proto.customer.v1beta1.GetRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.customer.v1beta1.GetResponse>}
 *     Promise that resolves to the response
 */
proto.customer.v1beta1.CustomerServicePromiseClient.prototype.get =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/customer.v1beta1.CustomerService/Get',
      request,
      metadata || {},
      methodDescriptor_CustomerService_Get);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.customer.v1beta1.UpdateRequest,
 *   !proto.customer.v1beta1.UpdateResponse>}
 */
const methodDescriptor_CustomerService_Update = new grpc.web.MethodDescriptor(
  '/customer.v1beta1.CustomerService/Update',
  grpc.web.MethodType.UNARY,
  proto.customer.v1beta1.UpdateRequest,
  proto.customer.v1beta1.UpdateResponse,
  /**
   * @param {!proto.customer.v1beta1.UpdateRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.customer.v1beta1.UpdateResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.customer.v1beta1.UpdateRequest,
 *   !proto.customer.v1beta1.UpdateResponse>}
 */
const methodInfo_CustomerService_Update = new grpc.web.AbstractClientBase.MethodInfo(
  proto.customer.v1beta1.UpdateResponse,
  /**
   * @param {!proto.customer.v1beta1.UpdateRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.customer.v1beta1.UpdateResponse.deserializeBinary
);


/**
 * @param {!proto.customer.v1beta1.UpdateRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.customer.v1beta1.UpdateResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.customer.v1beta1.UpdateResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.customer.v1beta1.CustomerServiceClient.prototype.update =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/customer.v1beta1.CustomerService/Update',
      request,
      metadata || {},
      methodDescriptor_CustomerService_Update,
      callback);
};


/**
 * @param {!proto.customer.v1beta1.UpdateRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.customer.v1beta1.UpdateResponse>}
 *     Promise that resolves to the response
 */
proto.customer.v1beta1.CustomerServicePromiseClient.prototype.update =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/customer.v1beta1.CustomerService/Update',
      request,
      metadata || {},
      methodDescriptor_CustomerService_Update);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.customer.v1beta1.SetRiskRequest,
 *   !proto.customer.v1beta1.SetRiskResponse>}
 */
const methodDescriptor_CustomerService_SetRisk = new grpc.web.MethodDescriptor(
  '/customer.v1beta1.CustomerService/SetRisk',
  grpc.web.MethodType.UNARY,
  proto.customer.v1beta1.SetRiskRequest,
  proto.customer.v1beta1.SetRiskResponse,
  /**
   * @param {!proto.customer.v1beta1.SetRiskRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.customer.v1beta1.SetRiskResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.customer.v1beta1.SetRiskRequest,
 *   !proto.customer.v1beta1.SetRiskResponse>}
 */
const methodInfo_CustomerService_SetRisk = new grpc.web.AbstractClientBase.MethodInfo(
  proto.customer.v1beta1.SetRiskResponse,
  /**
   * @param {!proto.customer.v1beta1.SetRiskRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.customer.v1beta1.SetRiskResponse.deserializeBinary
);


/**
 * @param {!proto.customer.v1beta1.SetRiskRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.customer.v1beta1.SetRiskResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.customer.v1beta1.SetRiskResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.customer.v1beta1.CustomerServiceClient.prototype.setRisk =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/customer.v1beta1.CustomerService/SetRisk',
      request,
      metadata || {},
      methodDescriptor_CustomerService_SetRisk,
      callback);
};


/**
 * @param {!proto.customer.v1beta1.SetRiskRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.customer.v1beta1.SetRiskResponse>}
 *     Promise that resolves to the response
 */
proto.customer.v1beta1.CustomerServicePromiseClient.prototype.setRisk =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/customer.v1beta1.CustomerService/SetRisk',
      request,
      metadata || {},
      methodDescriptor_CustomerService_SetRisk);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.customer.v1beta1.DeleteRequest,
 *   !proto.customer.v1beta1.DeleteResponse>}
 */
const methodDescriptor_CustomerService_Delete = new grpc.web.MethodDescriptor(
  '/customer.v1beta1.CustomerService/Delete',
  grpc.web.MethodType.UNARY,
  proto.customer.v1beta1.DeleteRequest,
  proto.customer.v1beta1.DeleteResponse,
  /**
   * @param {!proto.customer.v1beta1.DeleteRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.customer.v1beta1.DeleteResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.customer.v1beta1.DeleteRequest,
 *   !proto.customer.v1beta1.DeleteResponse>}
 */
const methodInfo_CustomerService_Delete = new grpc.web.AbstractClientBase.MethodInfo(
  proto.customer.v1beta1.DeleteResponse,
  /**
   * @param {!proto.customer.v1beta1.DeleteRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.customer.v1beta1.DeleteResponse.deserializeBinary
);


/**
 * @param {!proto.customer.v1beta1.DeleteRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.customer.v1beta1.DeleteResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.customer.v1beta1.DeleteResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.customer.v1beta1.CustomerServiceClient.prototype.delete =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/customer.v1beta1.CustomerService/Delete',
      request,
      metadata || {},
      methodDescriptor_CustomerService_Delete,
      callback);
};


/**
 * @param {!proto.customer.v1beta1.DeleteRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.customer.v1beta1.DeleteResponse>}
 *     Promise that resolves to the response
 */
proto.customer.v1beta1.CustomerServicePromiseClient.prototype.delete =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/customer.v1beta1.CustomerService/Delete',
      request,
      metadata || {},
      methodDescriptor_CustomerService_Delete);
};


module.exports = proto.customer.v1beta1;

