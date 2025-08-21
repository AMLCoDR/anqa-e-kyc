

kubectl get no -o wide && kubectl top no

kubectl drain <node-name>
# kubectl drain <node-name> --ignore-daemonsets --delete-local-data
kubectl delete node <node-name>