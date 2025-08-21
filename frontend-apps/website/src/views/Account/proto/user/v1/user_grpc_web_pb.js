/**
 * @fileoverview gRPC-Web generated client stub for user.v1
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.user = {};
proto.user.v1 = require('./user_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.user.v1.UserServiceClient =
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
proto.user.v1.UserServicePromiseClient =
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
 *   !proto.user.v1.SignUpRequest,
 *   !proto.user.v1.SignUpResponse>}
 */
const methodDescriptor_UserService_SignUp = new grpc.web.MethodDescriptor(
  '/user.v1.UserService/SignUp',
  grpc.web.MethodType.UNARY,
  proto.user.v1.SignUpRequest,
  proto.user.v1.SignUpResponse,
  /**
   * @param {!proto.user.v1.SignUpRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.user.v1.SignUpResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.user.v1.SignUpRequest,
 *   !proto.user.v1.SignUpResponse>}
 */
const methodInfo_UserService_SignUp = new grpc.web.AbstractClientBase.MethodInfo(
  proto.user.v1.SignUpResponse,
  /**
   * @param {!proto.user.v1.SignUpRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.user.v1.SignUpResponse.deserializeBinary
);


/**
 * @param {!proto.user.v1.SignUpRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.user.v1.SignUpResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.user.v1.SignUpResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.user.v1.UserServiceClient.prototype.signUp =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/user.v1.UserService/SignUp',
      request,
      metadata || {},
      methodDescriptor_UserService_SignUp,
      callback);
};


/**
 * @param {!proto.user.v1.SignUpRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.user.v1.SignUpResponse>}
 *     Promise that resolves to the response
 */
proto.user.v1.UserServicePromiseClient.prototype.signUp =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/user.v1.UserService/SignUp',
      request,
      metadata || {},
      methodDescriptor_UserService_SignUp);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.user.v1.AddRequest,
 *   !proto.user.v1.AddResponse>}
 */
const methodDescriptor_UserService_Add = new grpc.web.MethodDescriptor(
  '/user.v1.UserService/Add',
  grpc.web.MethodType.UNARY,
  proto.user.v1.AddRequest,
  proto.user.v1.AddResponse,
  /**
   * @param {!proto.user.v1.AddRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.user.v1.AddResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.user.v1.AddRequest,
 *   !proto.user.v1.AddResponse>}
 */
const methodInfo_UserService_Add = new grpc.web.AbstractClientBase.MethodInfo(
  proto.user.v1.AddResponse,
  /**
   * @param {!proto.user.v1.AddRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.user.v1.AddResponse.deserializeBinary
);


/**
 * @param {!proto.user.v1.AddRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.user.v1.AddResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.user.v1.AddResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.user.v1.UserServiceClient.prototype.add =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/user.v1.UserService/Add',
      request,
      metadata || {},
      methodDescriptor_UserService_Add,
      callback);
};


/**
 * @param {!proto.user.v1.AddRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.user.v1.AddResponse>}
 *     Promise that resolves to the response
 */
proto.user.v1.UserServicePromiseClient.prototype.add =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/user.v1.UserService/Add',
      request,
      metadata || {},
      methodDescriptor_UserService_Add);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.user.v1.QueryRequest,
 *   !proto.user.v1.QueryResponse>}
 */
const methodDescriptor_UserService_Query = new grpc.web.MethodDescriptor(
  '/user.v1.UserService/Query',
  grpc.web.MethodType.UNARY,
  proto.user.v1.QueryRequest,
  proto.user.v1.QueryResponse,
  /**
   * @param {!proto.user.v1.QueryRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.user.v1.QueryResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.user.v1.QueryRequest,
 *   !proto.user.v1.QueryResponse>}
 */
const methodInfo_UserService_Query = new grpc.web.AbstractClientBase.MethodInfo(
  proto.user.v1.QueryResponse,
  /**
   * @param {!proto.user.v1.QueryRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.user.v1.QueryResponse.deserializeBinary
);


/**
 * @param {!proto.user.v1.QueryRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.user.v1.QueryResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.user.v1.QueryResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.user.v1.UserServiceClient.prototype.query =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/user.v1.UserService/Query',
      request,
      metadata || {},
      methodDescriptor_UserService_Query,
      callback);
};


/**
 * @param {!proto.user.v1.QueryRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.user.v1.QueryResponse>}
 *     Promise that resolves to the response
 */
proto.user.v1.UserServicePromiseClient.prototype.query =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/user.v1.UserService/Query',
      request,
      metadata || {},
      methodDescriptor_UserService_Query);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.user.v1.GetRequest,
 *   !proto.user.v1.GetResponse>}
 */
const methodDescriptor_UserService_Get = new grpc.web.MethodDescriptor(
  '/user.v1.UserService/Get',
  grpc.web.MethodType.UNARY,
  proto.user.v1.GetRequest,
  proto.user.v1.GetResponse,
  /**
   * @param {!proto.user.v1.GetRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.user.v1.GetResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.user.v1.GetRequest,
 *   !proto.user.v1.GetResponse>}
 */
const methodInfo_UserService_Get = new grpc.web.AbstractClientBase.MethodInfo(
  proto.user.v1.GetResponse,
  /**
   * @param {!proto.user.v1.GetRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.user.v1.GetResponse.deserializeBinary
);


/**
 * @param {!proto.user.v1.GetRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.user.v1.GetResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.user.v1.GetResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.user.v1.UserServiceClient.prototype.get =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/user.v1.UserService/Get',
      request,
      metadata || {},
      methodDescriptor_UserService_Get,
      callback);
};


/**
 * @param {!proto.user.v1.GetRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.user.v1.GetResponse>}
 *     Promise that resolves to the response
 */
proto.user.v1.UserServicePromiseClient.prototype.get =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/user.v1.UserService/Get',
      request,
      metadata || {},
      methodDescriptor_UserService_Get);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.user.v1.UpdateRequest,
 *   !proto.user.v1.UpdateResponse>}
 */
const methodDescriptor_UserService_Update = new grpc.web.MethodDescriptor(
  '/user.v1.UserService/Update',
  grpc.web.MethodType.UNARY,
  proto.user.v1.UpdateRequest,
  proto.user.v1.UpdateResponse,
  /**
   * @param {!proto.user.v1.UpdateRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.user.v1.UpdateResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.user.v1.UpdateRequest,
 *   !proto.user.v1.UpdateResponse>}
 */
const methodInfo_UserService_Update = new grpc.web.AbstractClientBase.MethodInfo(
  proto.user.v1.UpdateResponse,
  /**
   * @param {!proto.user.v1.UpdateRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.user.v1.UpdateResponse.deserializeBinary
);


/**
 * @param {!proto.user.v1.UpdateRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.user.v1.UpdateResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.user.v1.UpdateResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.user.v1.UserServiceClient.prototype.update =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/user.v1.UserService/Update',
      request,
      metadata || {},
      methodDescriptor_UserService_Update,
      callback);
};


/**
 * @param {!proto.user.v1.UpdateRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.user.v1.UpdateResponse>}
 *     Promise that resolves to the response
 */
proto.user.v1.UserServicePromiseClient.prototype.update =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/user.v1.UserService/Update',
      request,
      metadata || {},
      methodDescriptor_UserService_Update);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.user.v1.DeleteRequest,
 *   !proto.user.v1.DeleteResponse>}
 */
const methodDescriptor_UserService_Delete = new grpc.web.MethodDescriptor(
  '/user.v1.UserService/Delete',
  grpc.web.MethodType.UNARY,
  proto.user.v1.DeleteRequest,
  proto.user.v1.DeleteResponse,
  /**
   * @param {!proto.user.v1.DeleteRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.user.v1.DeleteResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.user.v1.DeleteRequest,
 *   !proto.user.v1.DeleteResponse>}
 */
const methodInfo_UserService_Delete = new grpc.web.AbstractClientBase.MethodInfo(
  proto.user.v1.DeleteResponse,
  /**
   * @param {!proto.user.v1.DeleteRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.user.v1.DeleteResponse.deserializeBinary
);


/**
 * @param {!proto.user.v1.DeleteRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.user.v1.DeleteResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.user.v1.DeleteResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.user.v1.UserServiceClient.prototype.delete =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/user.v1.UserService/Delete',
      request,
      metadata || {},
      methodDescriptor_UserService_Delete,
      callback);
};


/**
 * @param {!proto.user.v1.DeleteRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.user.v1.DeleteResponse>}
 *     Promise that resolves to the response
 */
proto.user.v1.UserServicePromiseClient.prototype.delete =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/user.v1.UserService/Delete',
      request,
      metadata || {},
      methodDescriptor_UserService_Delete);
};


module.exports = proto.user.v1;

