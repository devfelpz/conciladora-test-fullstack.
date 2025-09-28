import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { apiDelete, apiGet, apiPost, apiPut } from '../api';
import EditUserForm from '../components/editUserForm/edit-user-form';
import Modal from '../components/modal/modal';
export default function ClientesPage() {
  const qc = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filtro, setFiltro] = useState('')
  const [mensalista, setMensalista] = useState('all')
  const [form, setForm] = useState({ nome: '', telefone: '', endereco: '', mensalista: false, valorMensalidade: '' })
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [editUserForm, setEditUserForm] = useState({ id: 0, nome: '', telefone: '', endereco: '', mensalista: false, valorMensalidade: '' })
  const [serverErrors, setServerErrors] = useState({});

  const abrirModal = (usuario) => {
    setUsuarioSelecionado(usuario);
    setEditUserForm({
      id: usuario.id,
      nome: usuario.nome,
      telefone: usuario.telefone,
      endereco: usuario.endereco,
      mensalista: usuario.mensalista,
      valorMensalidade: usuario.valorMensalidade
    })
    setIsModalOpen(true);
  };



  const q = useQuery({
    queryKey: ['clientes', filtro, mensalista],
    queryFn: () => apiGet(`/api/clientes?pagina=1&tamanho=20&filtro=${encodeURIComponent(filtro)}&mensalista=${mensalista}`)
  })

  const create = useMutation({
    mutationFn: (data) => apiPost('/api/clientes', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clientes'] })
  })

  const remover = useMutation({
    mutationFn: (id) => apiDelete(`/api/clientes/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clientes'] })
  })

  const editar = useMutation({
    mutationFn: async (data) => {
      return apiPut(`/api/clientes/${usuarioSelecionado.id}`, data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clientes"] });
      setIsModalOpen(false);
      alert("Cliente atualizado com sucesso!");
    },
    onError: (err) => {

      alert(err.message || "Erro desconhecido");
    },
  });




  return (
    <div>
      <h2>Clientes</h2>

      <div className="section">
        <div className="grid grid-3">
          <input placeholder="Buscar por nome" value={filtro} onChange={e => setFiltro(e.target.value)} />
          <select value={mensalista} onChange={e => setMensalista(e.target.value)}>
            <option value="all">Todos</option>
            <option value="true">Mensalistas</option>
            <option value="false">Não mensalistas</option>
          </select>
          <div />
        </div>
      </div>

      <h3>Novo cliente</h3>
      <div className="section">
        <div className="grid grid-4">
          <input placeholder="Nome" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
          <input placeholder="Telefone" value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} />
          <input placeholder="Endereço" value={form.endereco} onChange={e => setForm({ ...form, endereco: e.target.value })} />
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={form.mensalista} onChange={e => setForm({ ...form, mensalista: e.target.checked })} /> Mensalista
          </label>
          <input placeholder="Valor mensalidade" value={form.valorMensalidade} onChange={e => setForm({ ...form, valorMensalidade: e.target.value })} />
          <div />
          <div />
          <button onClick={() => create.mutate({
            nome: form.nome, telefone: form.telefone, endereco: form.endereco,
            mensalista: form.mensalista, valorMensalidade: form.valorMensalidade ? Number(form.valorMensalidade) : null
          })}>Salvar</button>
        </div>
      </div>



      <h3 style={{ marginTop: 16 }}>Lista</h3>
      <div className="section">
        {q.isLoading ? <p>Carregando...</p> : (
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Mensalista</th>
                <th colSpan={2} style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {q.data.itens.map(c => (
                <tr key={c.id}>
                  <td>{c.nome}</td>
                  <td>{c.telefone}</td>
                  <td>{c.mensalista ? 'Sim' : 'Não'}</td>
                  <td colSpan={2} style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', fontWeight: '500' }}>
                    <button style={{ border: '1px solid transparent', borderRadius: '4px', background: '#bf2424' }} onClick={() => remover.mutate(c.id)}>Excluir</button>
                    <button style={{ border: '1px solid transparent', borderRadius: '4px', background: '#2596be', fontWeight: '500' }} onClick={() => abrirModal(c)}>
                      Editar
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Editar usuário</h2>
        {usuarioSelecionado && (

          <EditUserForm
            usuario={usuarioSelecionado}
            onSubmit={(data) => {
              setServerErrors({});
              editar.mutate(data);
            }}
            isLoading={editar.isPending}
            serverError={serverErrors}
          />
        )}
      </Modal>

    </div>
  )
}
