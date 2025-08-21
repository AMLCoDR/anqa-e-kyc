/**
 * @fileoverview gRPC-Web generated client stub for idcheck.v2
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck



const grpc = {};
grpc.web = require('grpc-web');


var google_api_annotations_pb = require('../../google/api/annotations_pb.js')

var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js')
const proto = {};
proto.idcheck = {};
proto.idcheck.v2 = require('./id_check_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.idcheck.v2.IdCheckServiceClient =
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
proto.idcheck.v2.IdCheckServicePromiseClient =
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
 *   !proto.idcheck.v2.CheckRequest,
 *   !proto.idcheck.v2.CheckResponse>}
 */
const methodDescriptor_IdCheckService_Check = new grpc.web.MethodDescriptor(
  '/idcheck.v2.IdCheckService/Check',
  grpc.web.MethodType.UNARY,
  proto.idcheck.v2.CheckRequest,
  proto.idcheck.v2.CheckResponse,
  /**
   * @param {!proto.idcheck.v2.CheckRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.idcheck.v2.CheckResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.idcheck.v2.CheckRequest,
 *   !proto.idcheck.v2.CheckResponse>}
 */
const methodInfo_IdCheckService_Check = new grpc.web.AbstractClientBase.MethodInfo(
  proto.idcheck.v2.CheckResponse,
  /**
   * @param {!proto.idcheck.v2.CheckRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.idcheck.v2.CheckResponse.deserializeBinary
);


/**
 * @param {!proto.idcheck.v2.CheckRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.idcheck.v2.CheckResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.idcheck.v2.CheckResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.idcheck.v2.IdCheckServiceClient.prototype.check =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/idcheck.v2.IdCheckService/Check',
      request,
      metadata || {},
      methodDescriptor_IdCheckService_Check,
      callback);
};


/**
 * @param {!proto.idcheck.v2.CheckRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.idcheck.v2.CheckResponse>}
 *     Promise that resolves to the response
 */
proto.idcheck.v2.IdCheckServicePromiseClient.prototype.check =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/idcheck.v2.IdCheckService/Check',
      request,
      metadata || {},
      methodDescriptor_IdCheckService_Check);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.idcheck.v2.GetRequest,
 *   !proto.idcheck.v2.GetResponse>}
 */
const methodDescriptor_IdCheckService_Get = new grpc.web.MethodDescriptor(
  '/idcheck.v2.IdCheckService/Get',
  grpc.web.MethodType.UNARY,
  proto.idcheck.v2.GetRequest,
  proto.idcheck.v2.GetResponse,
  /**
   * @param {!proto.idcheck.v2.GetRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.idcheck.v2.GetResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.idcheck.v2.GetRequest,
 *   !proto.idcheck.v2.GetResponse>}
 */
const methodInfo_IdCheckService_Get = new grpc.web.AbstractClientBase.MethodInfo(
  proto.idcheck.v2.GetResponse,
  /**
   * @param {!proto.idcheck.v2.GetRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.idcheck.v2.GetResponse.deserializeBinary
);


/**
 * @param {!proto.idcheck.v2.GetRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.idcheck.v2.GetResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.idcheck.v2.GetResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.idcheck.v2.IdCheckServiceClient.prototype.get =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/idcheck.v2.IdCheckService/Get',
      request,
      metadata || {},
      methodDescriptor_IdCheckService_Get,
      callback);
};


/**
 * @param {!proto.idcheck.v2.GetRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.idcheck.v2.GetResponse>}
 *     Promise that resolves to the response
 */
proto.idcheck.v2.IdCheckServicePromiseClient.prototype.get =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/idcheck.v2.IdCheckService/Get',
      request,
      metadata || {},
      methodDescriptor_IdCheckService_Get);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.idcheck.v2.DeleteRequest,
 *   !proto.idcheck.v2.DeleteResponse>}
 */
const methodDescriptor_IdCheckService_Delete = new grpc.web.MethodDescriptor(
  '/idcheck.v2.IdCheckService/Delete',
  grpc.web.MethodType.UNARY,
  proto.idcheck.v2.DeleteRequest,
  proto.idcheck.v2.DeleteResponse,
  /**
   * @param {!proto.idcheck.v2.DeleteRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.idcheck.v2.DeleteResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.idcheck.v2.DeleteRequest,
 *   !proto.idcheck.v2.DeleteResponse>}
 */
const methodInfo_IdCheckService_Delete = new grpc.web.AbstractClientBase.MethodInfo(
  proto.idcheck.v2.DeleteResponse,
  /**
   * @param {!proto.idcheck.v2.DeleteRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.idcheck.v2.DeleteResponse.deserializeBinary
);


/**
 * @param {!proto.idcheck.v2.DeleteRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.idcheck.v2.DeleteResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.idcheck.v2.DeleteResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.idcheck.v2.IdCheckServiceClient.prototype.delete =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/idcheck.v2.IdCheckService/Delete',
      request,
      metadata || {},
      methodDescriptor_IdCheckService_Delete,
      callback);
};


/**
 * @param {!proto.idcheck.v2.DeleteRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.idcheck.v2.DeleteResponse>}
 *     Promise that resolves to the response
 */
proto.idcheck.v2.IdCheckServicePromiseClient.prototype.delete =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/idcheck.v2.IdCheckService/Delete',
      request,
      metadata || {},
      methodDescriptor_IdCheckService_Delete);
};


module.exports = proto.idcheck.v2;

