import React, { useState, useEffect } from 'react';
import InventoryService from '../services/InventoryService';
import InventoryTable from '../components/InventoryTable';
import "../styles/Inventories.css"
import MenuLateral from '../components/MenuLateral';
import CrearInventarioCuerpoModal from '../components/NewInventoryDialogBody';

function Inventories() {

    const [elementos, setElementos] = useState([]); // Inventarios disponibles
    const [selectedId, setSelectedId] = useState(1); // ID del inventario seleccionado, por ahora toma el primero, proximamente deberia comprobar si existe
    const [showInventoryTable, setShowInventoryTable] = useState(true);


    const [showModal, setShowModal] = useState(false);

    // Cargar los inventarios al inicio
    useEffect(() => {
        InventoryService.getAllInventories()
            .then(data => setElementos(data))
            .catch(error => console.error('Error al cargar inventarios:', error));
    }, []);

    // Mapeo la respuesta del axios...
    const inventories = [
        ...elementos.map((elemento) => ({
            id: elemento.id,
            label: elemento.name,
            icon: 'pi pi-table',
            attributes: elemento.attributes,
            command: () => handleSeleccionarElemento(elemento.id),

        }))
    ]

    // Manejar la eliminación de inventarios
    const handleDeleteInventory = () => {
        InventoryService.deleteInventoryById(selectedId)
            .then(() => {
                setElementos(prev => prev.filter(el => el.id !== selectedId));
                setSelectedId(null);
            })
            .catch(error => alert('No se pudo eliminar el inventario.'));
    };

    // Seleccionar un inventario
    const handleSeleccionarElemento = (id) => {
        setSelectedId(id);
    };

    // Cuerpo de la modal de eliminar inventarios
    const modalDeleteInventory = {
        title: "Eliminar Inventario",
        body: (
            <div style={{ display: 'flex', flexDirection: "column", gap: "1.5em" }}>
                ¿Desea eliminar este Inventario?
                <div style={{ display: 'flex', gap: "1em", justifyContent: 'space-evenly' }}>
                    <button onClick={() => setShowModal(false)}>
                        <i className=''></i>
                        Cancel
                    </button>
                    <button onClick={handleDeleteInventory}>
                        <i className='pi pi-trash'></i>
                        Delete
                    </button>
                </div>
            </div>
        )
    }

    const modalCreateInventory = {
        title: "Crear Inventario",
        body: (
            <div>
                <CrearInventarioCuerpoModal />
            </div>
        )
    }


    return (
        <div className="inventory">

            <div className="MenuLateral">
                <MenuLateral
                    titulo="Inventarios"
                    elementos={inventories}
                    showModal={showModal}
                    setShowModal={setShowModal}
                    modalCreate={modalCreateInventory}
                    modalDelete={modalDeleteInventory}
                />
            </div>
            <div className="inventarioTabla">
                {showInventoryTable && selectedId && (
                    <div>
                        <InventoryTable num={selectedId} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Inventories;
