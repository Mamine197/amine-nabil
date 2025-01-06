#include <napi.h>
#include "../../classes.cpp"

Napi::Object VolToObject(Napi::Env env, Vol vol) {
    Napi::Object obj = Napi::Object::New(env);
    
    obj.Set("compagnieAerienne", Napi::String::New(env, vol.CompagnieAerienne));
    obj.Set("dateDepart", Napi::String::New(env, vol.dateDepart));
    obj.Set("heureDepart", Napi::String::New(env, vol.heureDepart));
    obj.Set("heureArrivee", Napi::String::New(env, vol.heureArrivee));
    obj.Set("prix", Napi::Number::New(env, vol.prix));
    obj.Set("placesDisponible", Napi::Number::New(env, vol.placesDisponible));
    
    return obj;
}

Napi::Value AjouterVol(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    
    if (info.Length() < 1 || !info[0].IsObject()) {
        Napi::TypeError::New(env, "Object expected").ThrowAsJavaScriptException();
        return env.Null();
    }
    
    Napi::Object volData = info[0].As<Napi::Object>();
    Vol nouveauVol;
    
    nouveauVol.CompagnieAerienne = volData.Get("compagnieAerienne").As<Napi::String>();
    nouveauVol.dateDepart = volData.Get("dateDepart").As<Napi::String>();
    nouveauVol.heureDepart = volData.Get("heureDepart").As<Napi::String>();
    nouveauVol.heureArrivee = volData.Get("heureArrivee").As<Napi::String>();
    nouveauVol.prix = volData.Get("prix").As<Napi::Number>();
    nouveauVol.placesDisponible = volData.Get("placesDisponible").As<Napi::Number>();
    
    // Ajouter le vol à la base de données
    return VolToObject(env, nouveauVol);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set("ajouterVol", Napi::Function::New(env, AjouterVol));
    return exports;
}

NODE_API_MODULE(volInterface, Init)
