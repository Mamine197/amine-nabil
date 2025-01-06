#include <iostream>
#include <string>
#include <vector>
#include <fstream>
#include <nlohmann/json.hpp>

using json = nlohmann::json;
using namespace std;

class Aeroport {
private:
    string nomAeroport;
    string ville;
    string pays;
public:
    void setNomAeroport(const string& nom) { nomAeroport = nom; }
    void setVille(const string& v) { ville = v; }
    void setPays(const string& p) { pays = p; }
    
    string getNomAeroport() const { return nomAeroport; }
    string getVille() const { return ville; }
    string getPays() const { return pays; }
    
    json toJson() const {
        return {
            {"nom", nomAeroport},
            {"ville", ville},
            {"pays", pays}
        };
    }
};

class Vol {
public:
    string CompagnieAerienne;
    string dateDepart;
    string heureDepart;
    string heureArrivee;
    int prix;
    int placesDisponible;
    Aeroport depart;
    Aeroport destination;

    json toJson() const {
        return {
            {"compagnieAerienne", CompagnieAerienne},
            {"dateDepart", dateDepart},
            {"heureDepart", heureDepart},
            {"heureArrivee", heureArrivee},
            {"prix", prix},
            {"placesDisponibles", placesDisponible},
            {"depart", depart.toJson()},
            {"destination", destination.toJson()}
        };
    }

    void fromJson(const json& j) {
        CompagnieAerienne = j["compagnieAerienne"];
        dateDepart = j["dateDepart"];
        heureDepart = j["heureDepart"];
        heureArrivee = j["heureArrivee"];
        prix = j["prix"];
        placesDisponible = j["placesDisponibles"];
        
        // Aéroport de départ
        json departJson = j["depart"];
        depart.setNomAeroport(departJson["nom"]);
        depart.setVille(departJson["ville"]);
        depart.setPays(departJson["pays"]);
        
        // Aéroport de destination
        json destJson = j["destination"];
        destination.setNomAeroport(destJson["nom"]);
        destination.setVille(destJson["ville"]);
        destination.setPays(destJson["pays"]);
    }
};

int main(int argc, char* argv[]) {
    try {
        if (argc != 3) {
            cerr << "Usage: " << argv[0] << " <command> <json_file>" << endl;
            return 1;
        }

        string command = argv[1];
        string jsonFile = argv[2];

        // Lire le fichier JSON
        ifstream input(jsonFile);
        json data;
        input >> data;

        if (command == "create") {
            Vol vol;
            vol.fromJson(data);
            
            // Traitement de la création
            json result = vol.toJson();
            cout << result.dump(4) << endl;
        }
        else if (command == "list") {
            // Simuler une liste de vols
            vector<Vol> vols;
            Vol vol;
            vol.fromJson(data);
            vols.push_back(vol);
            
            json result = json::array();
            for (const auto& v : vols) {
                result.push_back(v.toJson());
            }
            cout << result.dump(4) << endl;
        }
        else {
            throw runtime_error("Commande non reconnue");
        }

        return 0;
    }
    catch (const exception& e) {
        json error = {
            {"error", true},
            {"message", e.what()}
        };
        cerr << error.dump(4) << endl;
        return 1;
    }
}
