from flask import Flask, request, jsonify, abort

app = Flask(__name__)

notes = []
current_id = 1

@app.route('/api/notes', methods=['GET'])
def get_notes():
    return jsonify(notes)

@app.route('/api/notes/<int:note_id>', methods=['GET'])
def get_note_by_id(note_id):
    note = next((note for note in notes if note['id'] == note_id), None)
    if note is None:
        abort(404)
    return jsonify(note)

@app.route('/api/notes', methods=['POST'])
def create_note():
    global current_id
    note = {
        'id': current_id,
        'title': request.json['title'],
        'description': request.json['description']
    }
    notes.append(note)
    current_id += 1
    return jsonify(note), 201

@app.route('/api/notes/<int:note_id>', methods=['PUT'])
def update_note(note_id):
    note = next((note for note in notes if note['id'] == note_id), None)
    if note is None:
        abort(404)
    note['title'] = request.json['title']
    note['description'] = request.json['description']
    return jsonify(note)

@app.route('/api/notes/<int:note_id>', methods=['DELETE'])
def delete_note(note_id):
    global notes
    notes = [note for note in notes if note['id'] != note_id]
    return '', 204

if __name__ == '__main__':
    app.run(debug=True)
