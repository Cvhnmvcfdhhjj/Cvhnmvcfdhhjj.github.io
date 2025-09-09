document.addEventListener('DOMContentLoaded', () => {
    const cropSelect = document.getElementById('crop-select');
    const noteTypeSelect = document.getElementById('note-type');
    const noteContentInput = document.getElementById('note-content');
    const saveNoteBtn = document.getElementById('save-note-btn');
    const notesList = document.getElementById('notes-list');

    const getNotes = () => {
        const notes = localStorage.getItem('farmNotes');
        return notes ? JSON.parse(notes) : [];
    };

    const saveNotes = (notes) => {
        localStorage.setItem('farmNotes', JSON.stringify(notes));
    };

    const renderNotes = () => {
        const selectedCrop = cropSelect.value;
        const allNotes = getNotes();
        const filteredNotes = allNotes.filter(note => note.crop === selectedCrop);

        notesList.innerHTML = '';

        if (filteredNotes.length === 0) {
            notesList.innerHTML = '<p>Nenhuma anotação para esta cultura.</p>';
            return;
        }

        filteredNotes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.classList.add('note');

            const noteTypeMap = {
                gastos: 'Gastos',
                mao_de_obra: 'Mão de Obra',
                adubacao: 'Adubação',
                tratamentos: 'Tratamentos',
                pluviometria: 'Pluviometria'
            };

            const noteDate = new Date(note.timestamp).toLocaleString('pt-BR');

            noteElement.innerHTML = `
                <div class="note-header">${noteTypeMap[note.type]}</div>
                <div class="note-date">${noteDate}</div>
                <div class="note-content">${note.content.replace(/\n/g, '<br>')}</div>
            `;
            notesList.appendChild(noteElement);
        });
    };

    saveNoteBtn.addEventListener('click', () => {
        const crop = cropSelect.value;
        const type = noteTypeSelect.value;
        const content = noteContentInput.value.trim();

        if (content === '') {
            alert('Por favor, preencha o conteúdo da anotação.');
            return;
        }

        const allNotes = getNotes();
        const newNote = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            crop: crop,
            type: type,
            content: content
        };

        allNotes.push(newNote);
        saveNotes(allNotes);

        noteContentInput.value = '';
        renderNotes();
    });

    cropSelect.addEventListener('change', renderNotes);

    // Initial render
    renderNotes();
});
