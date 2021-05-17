import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';

import { TarefasToolbar, TarefasTable } from './components';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@material-ui/core'
import axios from 'axios'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const TarefaList = () => {
  const classes = useStyles();

  const [tarefas, setTarefas] = useState([]);
  const [openDialog, setOpenDialog] = useState(false)
  const [mensagem, setMensagem] = useState('')

  const apiUrl = 'https://minhastarefas-api.herokuapp.com/tarefas'
  const email = { 'x-tenant-id': 'diegogb89@gmail.com' }

  const salvar = (tarefa) => {
    axios.post(apiUrl, tarefa, {
      headers: email
    }).then(response => {
      const novaTarefa = response.data
      setTarefas([...tarefas, novaTarefa])
      setMensagem('Item adicionado com sucesso')
      setOpenDialog(true)
    }).catch(erro => {
      setMensagem('Ocorreu um erro')
      setOpenDialog(true)
    })
  }

  const listarTarefas = () => {
    axios.get(apiUrl, {
      headers: email
    }).then(response => {
      const listaDeTarefas = response.data
      setTarefas(listaDeTarefas)
    }).catch(erro => {
      setMensagem('Ocorreu um erro ao tentar listar tarefas')
      setOpenDialog(true)
    })
  }

  const alterarStatus = (id) => {
    axios.patch(`${apiUrl}/${id}`, null, {
      headers: email
    }).then(response => {
      const lista = [...tarefas]
      lista.forEach(tarefa => {
        if(tarefa.id === id){
          tarefa.done = true;
        }
      })
      setTarefas(lista)
      setMensagem('Item atualizado com sucesso')
      setOpenDialog(true)
    }).catch(erro => {
      setMensagem('Ocorreu um erro')
      setOpenDialog(true)
    })
  }

  const deletar = (id) =>{
    axios.delete(`${apiUrl}/${id}`, {
      headers: email})
    .then(response => {
      const lista = tarefas.filter( tarefa => tarefa.id !== id)
      setTarefas(lista)
      setMensagem('Item deletado com sucesso')
      setOpenDialog(true)
    }).catch(erro => {
      setMensagem('Ocorreu um erro ao tentar deletar a tarefa')
      setOpenDialog(true)
    })
  }

  useEffect(() => {
    listarTarefas();
  }, [])

  return (
    <div className={classes.root}>
      <TarefasToolbar salvar={salvar} />
      <div className={classes.content}>
        <TarefasTable alterarStatus={alterarStatus}
                      deleteAction={deletar}
                      tarefas={tarefas} />
      </div>
      <Dialog open={openDialog} onClose={e => setOpenDialog(false)}>
        <DialogTitle>Atenção</DialogTitle>
        <DialogContent>
          {mensagem}
        </DialogContent>
        <DialogActions>
          <Button onClick={e => setOpenDialog(false)}>fechar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TarefaList;
