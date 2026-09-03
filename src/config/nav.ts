import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  KanbanSquare,
  Store,
  Wallet,
  MessageSquareText,
  MapPinned,
  Users,
  Settings,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
}

/**
 * Módulos do Portal F5. Cada item mapeia para uma base do Notion (ver CLAUDE.md →
 * "Mapa do ecossistema Notion") e, na maioria dos casos, para um ou mais agentes do
 * sistema. Módulos marcados com (Geral/SE/BA) aceitam ?estado= — ver StateTabs.
 */
export const navItems: NavItem[] = [
  {
    title: "Visão Geral",
    href: "/",
    icon: LayoutDashboard,
    description: "KPIs, funil consolidado e forecast (Agente 15 — BI). Geral/SE/BA.",
  },
  {
    title: "Pipeline",
    href: "/pipeline",
    icon: KanbanSquare,
    description: "Controle Geral: leads, temperatura, Score F5, SLA. Geral/SE/BA.",
  },
  {
    title: "Prospecção",
    href: "/prospeccao",
    icon: MapPinned,
    description: "Prospecções de campo: obras, condomínios, rodízio. SE/BA.",
  },
  {
    title: "Relacionamento",
    href: "/relacionamento",
    icon: Users,
    description: "Profissionais: arquitetos, engenheiros, construtoras. SE/BA.",
  },
  {
    title: "Scripts",
    href: "/scripts",
    icon: MessageSquareText,
    description: "Central de Scripts: taxa de resposta por empresa/etapa. SE/BA.",
  },
  {
    title: "Financeiro",
    href: "/financeiro",
    icon: Wallet,
    description: "Lançamentos e comissões: receita, despesa, repasses. Geral/SE/BA.",
  },
  {
    title: "Parceiros",
    href: "/parceiros",
    icon: Store,
    description: "Lojas parceiras, scorecard, contratos e comissão %.",
  },
  {
    title: "Configurações",
    href: "/configuracoes",
    icon: Settings,
    description: "Integração com Notion, usuários e preferências.",
  },
];
