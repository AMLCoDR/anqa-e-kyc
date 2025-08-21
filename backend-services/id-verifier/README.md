# README #

The `id-verifier` service is responsible for identity verification. It checks the 
provenance of identity documents with the document issuer using third-party services such
as GreenID.

The service does not maintain state (other than audit history) itself. Rather, a verified 
ID results in the generation — by the `vc-issuer` service — of a [Verified Credential](https://www.w3.org/TR/vc-data-model). The credential subsequently represents the person's identity verification.

## Getting Started
If you are new to Avid development please read 
[this guide to getting started](https://app.gitbook.com/@anqaml/s/docs/getting-started/overview)