/**
 * @fileoverview gRPC-Web generated client stub for subscription.v1
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck



const grpc = {};
grpc.web = require('grpc-web');


var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js')
const proto = {};
proto.subscription = {};
proto.subscription.v1 = require('./subscription_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.subscription.v1.SubscriptionServiceClient =
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
proto.subscription.v1.SubscriptionServicePromiseClient =
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
 *   !proto.google.protobuf.Empty,
 *   !proto.google.protobuf.Empty>}
 */
const methodDescriptor_SubscriptionService_Create = new grpc.web.MethodDescriptor(
  '/subscription.v1.SubscriptionService/Create',
  grpc.web.MethodType.UNARY,
  google_protobuf_empty_pb.Empty,
  google_protobuf_empty_pb.Empty,
  /**
   * @param {!proto.google.protobuf.Empty} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  google_protobuf_empty_pb.Empty.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.google.protobuf.Empty,
 *   !proto.google.protobuf.Empty>}
 */
const methodInfo_SubscriptionService_Create = new grpc.web.AbstractClientBase.MethodInfo(
  google_protobuf_empty_pb.Empty,
  /**
   * @param {!proto.google.protobuf.Empty} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  google_protobuf_empty_pb.Empty.deserializeBinary
);


/**
 * @param {!proto.google.protobuf.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.google.protobuf.Empty)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.google.protobuf.Empty>|undefined}
 *     The XHR Node Readable Stream
 */
proto.subscription.v1.SubscriptionServiceClient.prototype.create =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/subscription.v1.SubscriptionService/Create',
      request,
      metadata || {},
      methodDescriptor_SubscriptionService_Create,
      callback);
};


/**
 * @param {!proto.google.protobuf.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.google.protobuf.Empty>}
 *     Promise that resolves to the response
 */
proto.subscription.v1.SubscriptionServicePromiseClient.prototype.create =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/subscription.v1.SubscriptionService/Create',
      request,
      metadata || {},
      methodDescriptor_SubscriptionService_Create);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.google.protobuf.Empty,
 *   !proto.subscription.v1.Plan>}
 */
const methodDescriptor_SubscriptionService_GetPlan = new grpc.web.MethodDescriptor(
  '/subscription.v1.SubscriptionService/GetPlan',
  grpc.web.MethodType.UNARY,
  google_protobuf_empty_pb.Empty,
  proto.subscription.v1.Plan,
  /**
   * @param {!proto.google.protobuf.Empty} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.subscription.v1.Plan.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.google.protobuf.Empty,
 *   !proto.subscription.v1.Plan>}
 */
const methodInfo_SubscriptionService_GetPlan = new grpc.web.AbstractClientBase.MethodInfo(
  proto.subscription.v1.Plan,
  /**
   * @param {!proto.google.protobuf.Empty} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.subscription.v1.Plan.deserializeBinary
);


/**
 * @param {!proto.google.protobuf.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.subscription.v1.Plan)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.subscription.v1.Plan>|undefined}
 *     The XHR Node Readable Stream
 */
proto.subscription.v1.SubscriptionServiceClient.prototype.getPlan =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/subscription.v1.SubscriptionService/GetPlan',
      request,
      metadata || {},
      methodDescriptor_SubscriptionService_GetPlan,
      callback);
};


/**
 * @param {!proto.google.protobuf.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.subscription.v1.Plan>}
 *     Promise that resolves to the response
 */
proto.subscription.v1.SubscriptionServicePromiseClient.prototype.getPlan =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/subscription.v1.SubscriptionService/GetPlan',
      request,
      metadata || {},
      methodDescriptor_SubscriptionService_GetPlan);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.subscription.v1.AccessPortalRequest,
 *   !proto.subscription.v1.AccessPortalResponse>}
 */
const methodDescriptor_SubscriptionService_AccessPortal = new grpc.web.MethodDescriptor(
  '/subscription.v1.SubscriptionService/AccessPortal',
  grpc.web.MethodType.UNARY,
  proto.subscription.v1.AccessPortalRequest,
  proto.subscription.v1.AccessPortalResponse,
  /**
   * @param {!proto.subscription.v1.AccessPortalRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.subscription.v1.AccessPortalResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.subscription.v1.AccessPortalRequest,
 *   !proto.subscription.v1.AccessPortalResponse>}
 */
const methodInfo_SubscriptionService_AccessPortal = new grpc.web.AbstractClientBase.MethodInfo(
  proto.subscription.v1.AccessPortalResponse,
  /**
   * @param {!proto.subscription.v1.AccessPortalRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.subscription.v1.AccessPortalResponse.deserializeBinary
);


/**
 * @param {!proto.subscription.v1.AccessPortalRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.subscription.v1.AccessPortalResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.subscription.v1.AccessPortalResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.subscription.v1.SubscriptionServiceClient.prototype.accessPortal =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/subscription.v1.SubscriptionService/AccessPortal',
      request,
      metadata || {},
      methodDescriptor_SubscriptionService_AccessPortal,
      callback);
};


/**
 * @param {!proto.subscription.v1.AccessPortalRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.subscription.v1.AccessPortalResponse>}
 *     Promise that resolves to the response
 */
proto.subscription.v1.SubscriptionServicePromiseClient.prototype.accessPortal =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/subscription.v1.SubscriptionService/AccessPortal',
      request,
      metadata || {},
      methodDescriptor_SubscriptionService_AccessPortal);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.google.protobuf.Empty,
 *   !proto.google.protobuf.Empty>}
 */
const methodDescriptor_SubscriptionService_Delete = new grpc.web.MethodDescriptor(
  '/subscription.v1.SubscriptionService/Delete',
  grpc.web.MethodType.UNARY,
  google_protobuf_empty_pb.Empty,
  google_protobuf_empty_pb.Empty,
  /**
   * @param {!proto.google.protobuf.Empty} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  google_protobuf_empty_pb.Empty.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.google.protobuf.Empty,
 *   !proto.google.protobuf.Empty>}
 */
const methodInfo_SubscriptionService_Delete = new grpc.web.AbstractClientBase.MethodInfo(
  google_protobuf_empty_pb.Empty,
  /**
   * @param {!proto.google.protobuf.Empty} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  google_protobuf_empty_pb.Empty.deserializeBinary
);


/**
 * @param {!proto.google.protobuf.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.google.protobuf.Empty)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.google.protobuf.Empty>|undefined}
 *     The XHR Node Readable Stream
 */
proto.subscription.v1.SubscriptionServiceClient.prototype.delete =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/subscription.v1.SubscriptionService/Delete',
      request,
      metadata || {},
      methodDescriptor_SubscriptionService_Delete,
      callback);
};


/**
 * @param {!proto.google.protobuf.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.google.protobuf.Empty>}
 *     Promise that resolves to the response
 */
proto.subscription.v1.SubscriptionServicePromiseClient.prototype.delete =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/subscription.v1.SubscriptionService/Delete',
      request,
      metadata || {},
      methodDescriptor_SubscriptionService_Delete);
};


module.exports = proto.subscription.v1;

