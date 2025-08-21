

# 0. Delete Istio
# istioctl manifest generate | kubectl delete --ignore-not-found=true -f -
istioctl x uninstall --purge
kubectl delete namespace istio-system

# # 1. Install Istio
terraform taint module.istio.kubectl_manifest.base
for i in {0..10}; do terraform taint "module.istio.kubectl_manifest.istiod[${i}]"; done
for i in {0..5}; do terraform taint "module.istio.kubectl_manifest.ingress[${i}]"; done
for i in {0..5}; do terraform taint "module.istio.kubectl_manifest.egress[${i}]"; done

# # 2. Install Avid Gateway
terraform taint module.ingress.helm_release.ingress

# 3. Install Avid mesh config
terraform taint module.mesh.helm_release.mesh

# 4. Update subscription module config

# 5. Redeploy services
