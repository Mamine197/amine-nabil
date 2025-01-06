#include <napi.h>
#include "classes.h"

Napi::Object VolToObject(Napi::Env env, const Vol& vol) {
    Napi::Object obj = Napi::Object::New(env);
    
    obj.Set("compagnieAerienne", Napi::String::New(env, vol.getCompagnieAerienne()));
    obj.Set("dateDepart", Napi::String::New(env, vol.getDateDepart()));
    obj.Set("heureDepart", Napi::String::New(env, vol.getHeureDepart()));
    obj.Set("heureArrivee", Napi::String::New(env, vol.getHeureArrivee()));
    obj.Set("prix", Napi::Number::New(env, vol.getPrix()));
    obj.Set("placesDisponibles", Napi::Number::New(env, vol.getPlacesDisponibles()));

    // Conversion des aéroports
    Napi::Object departObj = Napi::Object::New(env);
    departObj.Set("nom", Napi::String::New(env, vol.getDepart().getNomAeroport()));
    departObj.Set("ville", Napi::String::New(env, vol.getDepart().getVille()));
    departObj.Set("pays", Napi::String::New(env, vol.getDepart().getPays()));
    obj.Set("depart", departObj);

    Napi::Object destObj = Napi::Object::New(env);
    destObj.Set("nom", Napi::String::New(env, vol.getDestination().getNomAeroport()));
    destObj.Set("ville", Napi::String::New(env, vol.getDestination().getVille()));
    destObj.Set("pays", Napi::String::New(env, vol.getDestination().getPays()));
    obj.Set("destination", destObj);
    
    return obj;
}

Napi::Value CreerVol(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    
    if (info.Length() < 1 || !info[0].IsObject()) {
        Napi::TypeError::New(env, "Object expected").ThrowAsJavaScriptException();
        return env.Null();
    }
    
    Napi::Object volData = info[0].As<Napi::Object>();
    
    Vol nouveauVol;
    nouveauVol.setCompagnieAerienne(volData.Get("compagnieAerienne").As<Napi::String>());
    nouveauVol.setDateDepart(volData.Get("dateDepart").As<Napi::String>());
    nouveauVol.setHeureDepart(volData.Get("heureDepart").As<Napi::String>());
    nouveauVol.setHeureArrivee(volData.Get("heureArrivee").As<Napi::String>());
    nouveauVol.setPrix(volData.Get("prix").As<Napi::Number>().DoubleValue());
    nouveauVol.setPlacesDisponibles(volData.Get("placesDisponibles").As<Napi::Number>().Int32Value());
    
    // Configuration des aéroports
    Napi::Object departData = volData.Get("depart").As<Napi::Object>();
    Aeroport depart;
    depart.setNomAeroport(departData.Get("nom").As<Napi::String>());
    depart.setVille(departData.Get("ville").As<Napi::String>());
    depart.setPays(departData.Get("pays").As<Napi::String>());
    nouveauVol.setDepart(depart);
    
    Napi::Object destData = volData.Get("destination").As<Napi::Object>();
    Aeroport destination;
    destination.setNomAeroport(destData.Get("nom").As<Napi::String>());
    destination.setVille(destData.Get("ville").As<Napi::String>());
    destination.setPays(destData.Get("pays").As<Napi::String>());
    nouveauVol.setDestination(destination);
    
    return VolToObject(env, nouveauVol);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set("creerVol", Napi::Function::New(env, CreerVol));
    return exports;
}

NODE_API_MODULE(vol_wrapper, Init)
