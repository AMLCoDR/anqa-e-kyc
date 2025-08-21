/**
 * @fileoverview gRPC-Web generated client stub for idcheck.v3
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
proto.idcheck.v3 = require('./id_check_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.idcheck.v3.IdCheckServiceClient =
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
proto.idcheck.v3.IdCheckServicePromiseClient =
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
 *   !proto.idcheck.v3.CheckRequest,
 *   !proto.idcheck.v3.CheckResponse>}
 */
const methodDescriptor_IdCheckService_Check = new grpc.web.MethodDescriptor(
  '/idcheck.v3.IdCheckService/Check',
  grpc.web.MethodType.UNARY,
  proto.idcheck.v3.CheckRequest,
  proto.idcheck.v3.CheckResponse,
  /**
   * @param {!proto.idcheck.v3.CheckRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.idcheck.v3.CheckResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.idcheck.v3.CheckRequest,
 *   !proto.idcheck.v3.CheckResponse>}
 */
const methodInfo_IdCheckService_Check = new grpc.web.AbstractClientBase.MethodInfo(
  proto.idcheck.v3.CheckResponse,
  /**
   * @param {!proto.idcheck.v3.CheckRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.idcheck.v3.CheckResponse.deserializeBinary
);


/**
 * @param {!proto.idcheck.v3.CheckRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.idcheck.v3.CheckResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.idcheck.v3.CheckResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.idcheck.v3.IdCheckServiceClient.prototype.check =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/idcheck.v3.IdCheckService/Check',
      request,
      metadata || {},
      methodDescriptor_IdCheckService_Check,
      callback);
};


/**
 * @param {!proto.idcheck.v3.CheckRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.idcheck.v3.CheckResponse>}
 *     Promise that resolves to the response
 */
proto.idcheck.v3.IdCheckServicePromiseClient.prototype.check =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/idcheck.v3.IdCheckService/Check',
      request,
      metadata || {},
      methodDescriptor_IdCheckService_Check);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.idcheck.v3.GetRequest,
 *   !proto.idcheck.v3.GetResponse>}
 */
const methodDescriptor_IdCheckService_Get = new grpc.web.MethodDescriptor(
  '/idcheck.v3.IdCheckService/Get',
  grpc.web.MethodType.UNARY,
  proto.idcheck.v3.GetRequest,
  proto.idcheck.v3.GetResponse,
  /**
   * @param {!proto.idcheck.v3.GetRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.idcheck.v3.GetResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.idcheck.v3.GetRequest,
 *   !proto.idcheck.v3.GetResponse>}
 */
const methodInfo_IdCheckService_Get = new grpc.web.AbstractClientBase.MethodInfo(
  proto.idcheck.v3.GetResponse,
  /**
   * @param {!proto.idcheck.v3.GetRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.idcheck.v3.GetResponse.deserializeBinary
);


/**
 * @param {!proto.idcheck.v3.GetRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.idcheck.v3.GetResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.idcheck.v3.GetResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.idcheck.v3.IdCheckServiceClient.prototype.get =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/idcheck.v3.IdCheckService/Get',
      request,
      metadata || {},
      methodDescriptor_IdCheckService_Get,
      callback);
};


/**
 * @param {!proto.idcheck.v3.GetRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.idcheck.v3.GetResponse>}
 *     Promise that resolves to the response
 */
proto.idcheck.v3.IdCheckServicePromiseClient.prototype.get =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/idcheck.v3.IdCheckService/Get',
      request,
      metadata || {},
      methodDescriptor_IdCheckService_Get);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.idcheck.v3.DeleteRequest,
 *   !proto.idcheck.v3.DeleteResponse>}
 */
const methodDescriptor_IdCheckService_Delete = new grpc.web.MethodDescriptor(
  '/idcheck.v3.IdCheckService/Delete',
  grpc.web.MethodType.UNARY,
  proto.idcheck.v3.DeleteRequest,
  proto.idcheck.v3.DeleteResponse,
  /**
   * @param {!proto.idcheck.v3.DeleteRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.idcheck.v3.DeleteResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.idcheck.v3.DeleteRequest,
 *   !proto.idcheck.v3.DeleteResponse>}
 */
const methodInfo_IdCheckService_Delete = new grpc.web.AbstractClientBase.MethodInfo(
  proto.idcheck.v3.DeleteResponse,
  /**
   * @param {!proto.idcheck.v3.DeleteRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.idcheck.v3.DeleteResponse.deserializeBinary
);


/**
 * @param {!proto.idcheck.v3.DeleteRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.idcheck.v3.DeleteResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.idcheck.v3.DeleteResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.idcheck.v3.IdCheckServiceClient.prototype.delete =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/idcheck.v3.IdCheckService/Delete',
      request,
      metadata || {},
      methodDescriptor_IdCheckService_Delete,
      callback);
};


/**
 * @param {!proto.idcheck.v3.DeleteRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.idcheck.v3.DeleteResponse>}
 *     Promise that resolves to the response
 */
proto.idcheck.v3.IdCheckServicePromiseClient.prototype.delete =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/idcheck.v3.IdCheckService/Delete',
      request,
      metadata || {},
      methodDescriptor_IdCheckService_Delete);
};


module.exports = proto.idcheck.v3;

