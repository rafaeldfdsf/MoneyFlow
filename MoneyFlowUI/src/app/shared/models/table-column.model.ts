/** Representa uma ação (botão, ícone, menu, etc.) que pode ser exibida dentro de uma coluna da tabela */
export type TableColumnAction<T> = {
    /** Ícone PrimeIcons, ex: 'pi pi-pencil' */
    icon: string;

    /** Texto opcional exibido no botão */
    label?: string;

    /** Classe CSS adicional (ex: 'p-button-danger') */
    class?: string;

    /** Função executada quando a ação é clicada */
    onClick: (row: T) => void;
};

/** Representa a definição de uma coluna genérica de tabela */
export type TableColumnDefinition<T> = {
    /** Campo da entidade (pode usar dot notation, ex: 'cliente.nome') */
    field: string;

    /** Título exibido no cabeçalho da tabela */
    header: string;

    /** Se a coluna pode ser ordenada */
    sortable?: boolean;

    /** Tipo de dados (usado para formatação automática) */
    type?: 'text' | 'date' | 'currency' | 'number' | 'boolean';

    /** Largura da coluna (ex: '120px' ou '10%') */
    width?: string;

    /** Alinhamento horizontal */
    align?: 'left' | 'center' | 'right';

    /** Formatação personalizada */
    format?: (value: any) => string;

    /** Lista de ações associadas a esta coluna */
    actions?: TableColumnAction<T>[];

    /** Template customizado (caso seja projetado via ContentChild) */
    template?: any;
};