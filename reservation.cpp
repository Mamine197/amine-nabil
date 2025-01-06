#include <iostream>
#include <string>
#include <ctime>
#include <sstream>

using namespace std;

class Aeroport {
private:
    int idAeroport;
    string nomAeroport;
    string ville;
    string pays;
public:
    void setAeroport(const string& nom, const string& v, const string& p) {
        nomAeroport = nom;
        ville = v;
        pays = p;
    }
    
    string toString() const {
        stringstream ss;
        ss << "{\"nomAeroport\":\"" << nomAeroport 
           << "\",\"ville\":\"" << ville 
           << "\",\"pays\":\"" << pays << "\"}";
        return ss.str();
    }
};

class Escale {
private:
    int idEscale;
    string heureDepartEscale;
    string heureFinEscale;
public:
    void setEscale(const string& depart, const string& fin) {
        heureDepartEscale = depart;
        heureFinEscale = fin;
    }
    
    string toString() const {
        stringstream ss;
        ss << "{\"heureDepartEscale\":\"" << heureDepartEscale 
           << "\",\"heureFinEscale\":\"" << heureFinEscale << "\"}";
        return ss.str();
    }
};

class Client {
private:
    int idClient;
    string nom;
    string prenom;
    string email;
    string numeroTelephone;
    
public:
    void setClient(const string& n, const string& p, const string& e, const string& tel) {
        nom = n;
        prenom = p;
        email = e;
        numeroTelephone = tel;
    }
    
    string toString() const {
        stringstream ss;
        ss << "{\"nom\":\"" << nom 
           << "\",\"prenom\":\"" << prenom 
           << "\",\"email\":\"" << email 
           << "\",\"numeroTelephone\":\"" << numeroTelephone << "\"}";
        return ss.str();
    }
};

class Billet {
private:
    int idBillet;
    string classe;
    int prix;
    
public:
    void setBillet(const string& c, int p) {
        classe = c;
        prix = p;
    }
    
    string toString() const {
        stringstream ss;
        ss << "{\"classe\":\"" << classe 
           << "\",\"prix\":" << prix << "}";
        return ss.str();
    }
};

class Reservation {
private:
    int idReservation;
    string dateReservation;
    string statut;
    Client client;
    Billet billet;
    
public:
    void creerReservation(const string& nom, const string& prenom, 
                         const string& email, const string& tel,
                         const string& classe, int prix) {
        client.setClient(nom, prenom, email, tel);
        billet.setBillet(classe, prix);
        statut = "Confirme";
        
        // Générer un ID unique pour la réservation
        idReservation = rand();
        
        // Obtenir la date actuelle
        time_t now = time(0);
        dateReservation = ctime(&now);
    }
    
    string toString() const {
        stringstream ss;
        ss << "{\"idReservation\":" << idReservation 
           << ",\"dateReservation\":\"" << dateReservation 
           << "\",\"statut\":\"" << statut 
           << "\",\"client\":" << client.toString() 
           << ",\"billet\":" << billet.toString() << "}";
        return ss.str();
    }
};

// Fonction pour extraire la valeur d'une clé d'une chaîne JSON simple
string extractValue(const string& json, const string& key) {
    size_t pos = json.find("\"" + key + "\":");
    if (pos == string::npos) return "";
    
    pos = json.find("\"", pos + key.length() + 2);
    if (pos == string::npos) return "";
    
    size_t end = json.find("\"", pos + 1);
    if (end == string::npos) return "";
    
    return json.substr(pos + 1, end - pos - 1);
}

int extractPrice(const string& json) {
    size_t pos = json.find("\"prix\":");
    if (pos == string::npos) return 0;
    
    pos += 7; // Longueur de "\"prix\":"
    size_t end = json.find(",", pos);
    if (end == string::npos) end = json.find("}", pos);
    if (end == string::npos) return 0;
    
    string priceStr = json.substr(pos, end - pos);
    return stoi(priceStr);
}

int main() {
    // Lecture des données depuis l'entrée standard
    string input;
    getline(cin, input);
    
    try {
        // Extraire les données du JSON
        string nom = extractValue(input, "nom");
        string prenom = extractValue(input, "prenom");
        string email = extractValue(input, "email");
        string telephone = extractValue(input, "telephone");
        string classe = extractValue(input, "classe");
        int prix = extractPrice(input);
        
        // Créer la réservation
        Reservation reservation;
        reservation.creerReservation(nom, prenom, email, telephone, classe, prix);
        
        // Retourner le résultat en JSON
        cout << reservation.toString() << endl;
        
        return 0;
    } catch (const exception& e) {
        cout << "{\"error\":\"" << e.what() << "\"}" << endl;
        return 1;
    }
}
