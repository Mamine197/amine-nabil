const { spawn } = require('child_process');
const path = require('path');

class ReservationCppService {
    constructor() {
        this.cppProgramPath = path.join(__dirname, '../cpp_program/reservation');
    }

    async createReservation(reservationData) {
        return new Promise((resolve, reject) => {
            const cppProcess = spawn(this.cppProgramPath);
            let output = '';
            let errorOutput = '';

            // Envoyer les données au programme C++
            cppProcess.stdin.write(JSON.stringify(reservationData));
            cppProcess.stdin.end();

            // Récupérer la sortie du programme
            cppProcess.stdout.on('data', (data) => {
                output += data.toString();
            });

            cppProcess.stderr.on('data', (data) => {
                errorOutput += data.toString();
            });

            cppProcess.on('close', (code) => {
                if (code !== 0) {
                    console.error('Erreur C++:', errorOutput);
                    reject(new Error(`Le programme C++ a échoué avec le code ${code}: ${errorOutput}`));
                    return;
                }

                try {
                    const result = JSON.parse(output);
                    resolve(result);
                } catch (error) {
                    reject(new Error(`Erreur lors du parsing de la sortie JSON: ${error.message}`));
                }
            });
        });
    }
}

module.exports = new ReservationCppService();
