# README #

The `identity` service maintains information about an individual's identity with the system. The service uses
[Verifiable Credentials](https://www.w3.org/TR/vc-data-model) to record aspects of identity that have been verified
against a third-party source. For example, the individual's passport details.

Identity can be reused across Reporting Entities as long as:
1. Consent has been given by the individual.
2. ID verification checks are rerun for each Reporting Entity that uses the identity.

## Managing identity records

Steps to 'safely' managing identity records:
1. Collect individual's identity document(s).
2. Confirm informed consent for reuse of the documents (and any other documentation such as proofs of address, trust deeds, etc).
3. Record dates of expiry on identity documents and, where appropriate, on any other documents (time limits are dictated by 
their compliance programme - but across the board the accepted time frame from the regulators perspective is 3 months) to 
know when to ask for updated documentation.
4. Notify the individual when we intend to reuse it to allow them to 'opt out'. This trigger 
should tell them what information will be reused, which reporting entity it is for and the nature of the transaction 
(aka listing of your property, merger of company X & Y).

## Getting Started

If you are new to Avid development please read 
[this guide to getting started](https://app.gitbook.com/@anqaml/s/docs/getting-started/overview).