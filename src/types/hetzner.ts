export interface HetznerError extends Error {
  status: number;
  code: string;
  details?: unknown;
}

export interface Pagination {
  page: number;
  per_page: number;
  previous_page: number | null;
  next_page: number | null;
  last_page: number;
  total_entries: number;
}

export interface Meta {
  pagination?: Pagination;
}

export interface Location {
  id: number;
  name: string;
  description: string;
  country: string;
  city: string;
  latitude: number;
  longitude: number;
  network_zone: string;
}

export interface Datacenter {
  id: number;
  name: string;
  description: string;
  location: Location;
}

export interface ServerType {
  id: number;
  name: string;
  description: string;
  cores: number;
  memory: number;
  disk: number;
  deprecated: boolean;
  prices: any[];
}

export interface Image {
  id: number;
  type: string;
  status: string;
  name: string | null;
  description: string;
  image_size: number | null;
  disk_size: number;
  created: string;
  os_flavor: string;
  os_version: string | null;
  architecture: string;
  rapid_deploy: boolean;
  protection: { delete: boolean };
  labels: Record<string, string>;
}

export interface SshKey {
  id: number;
  name: string;
  fingerprint: string;
  public_key: string;
  labels: Record<string, string>;
  created: string;
}

export interface Server {
  id: number;
  name: string;
  status: 'running' | 'off' | 'initializing' | 'starting' | 'stopping' | 'unknown';
  public_net: {
    ipv4: { ip: string; blocked: boolean; dns_ptr: string } | null;
    ipv6: { ip: string; blocked: boolean; dns_ptr: string } | null;
    floating_ips: number[];
    firewalls: { id: number; status: string }[];
  };
  private_net: { network: number; ip: string; aliases: string[]; mac_address: string }[];
  server_type: ServerType;
  datacenter: Datacenter;
  image: Image | null;
  iso: any | null;
  rescue_enabled: boolean;
  locked: boolean;
  backup_window: string | null;
  outgoing_traffic: number | null;
  ingoing_traffic: number | null;
  included_traffic: number;
  protection: { delete: boolean; rebuild: boolean };
  labels: Record<string, string>;
  created: string;
  volumes: number[];
  load_balancers: number[];
  placement_group: { id: number; name: string; type: string } | null;
}

export interface Volume {
  id: number;
  created: string;
  name: string;
  size: number;
  server: number | null;
  location: Location;
  status: string;
  protection: { delete: boolean };
  labels: Record<string, string>;
  linux_device: string;
  format: string | null;
}

export interface Network {
  id: number;
  name: string;
  ip_range: string;
  subnets: any[];
  routes: any[];
  servers: number[];
  load_balancers: number[];
  protection: { delete: boolean };
  labels: Record<string, string>;
  created: string;
}

export interface Firewall {
  id: number;
  name: string;
  rules: { direction: string; protocol: string; port: string | null; source_ips: string[]; destination_ips: string[] }[];
  applied_to: { type: string; server?: { id: number }; label_selector?: { selector: string } }[];
  protection: { delete: boolean };
  labels: Record<string, string>;
  created: string;
}

export interface LoadBalancer {
  id: number;
  name: string;
  public_net: { enabled: boolean; ipv4: { ip: string } | null; ipv6: { ip: string } | null };
  private_net: any[];
  location: Location;
  load_balancer_type: any;
  protection: { delete: boolean };
  labels: Record<string, string>;
  targets: any[];
  services: any[];
  created: string;
}

export interface FloatingIp {
  id: number;
  type: 'ipv4' | 'ipv6';
  server: number | null;
  home_location: Location;
  blocked: boolean;
  protection: { delete: boolean };
  name: string | null;
  description: string | null;
  ip: string;
  dns_ptr: string[];
  labels: Record<string, string>;
  created: string;
}

export interface PrimaryIp {
  id: number;
  type: 'ipv4' | 'ipv6';
  name: string | null;
  description: string | null;
  ip: string;
  dns_ptr: string | null;
  datacenter: Datacenter;
  blocked: boolean;
  protection: { delete: boolean };
  assignee_id: number | null;
  assignee_type: string | null;
  auto_delete: boolean;
  labels: Record<string, string>;
  created: string;
}

export interface PlacementGroup {
  id: number;
  name: string;
  type: string;
  servers: number[];
  labels: Record<string, string>;
  created: string;
}

export interface Pricing {
  currency: string;
  vat_rate: string;
  image: any;
  floating_ip: any;
  primary_ip: any;
  server_backup: any;
  server_types: any[];
  load_balancer_types: any[];
  volumes: any;
  traffic: any;
}

export interface Action {
  id: number;
  command: string;
  status: 'running' | 'success' | 'error';
  progress: number;
  started: string;
  finished: string | null;
  resources: { id: number; type: string }[];
  error: { code: string; message: string } | null;
}

// List response wrappers
export interface ListResponse<T> { [key: string]: T[] | Meta; meta?: Meta; }
export type ServersResponse = { servers: Server[]; meta: Meta };
export type VolumesResponse = { volumes: Volume[]; meta: Meta };
export type NetworksResponse = { networks: Network[]; meta: Meta };
export type FirewallsResponse = { firewalls: Firewall[]; meta: Meta };
export type LoadBalancersResponse = { load_balancers: LoadBalancer[]; meta: Meta };
export type FloatingIpsResponse = { floating_ips: FloatingIp[]; meta: Meta };
export type PrimaryIpsResponse = { primary_ips: PrimaryIp[]; meta: Meta };
export type SshKeysResponse = { ssh_keys: SshKey[]; meta: Meta };
export type ImagesResponse = { images: Image[]; meta: Meta };
export type LocationsResponse = { locations: Location[]; meta: Meta };
export type ServerTypesResponse = { server_types: ServerType[]; meta: Meta };
export type PlacementGroupsResponse = { placement_groups: PlacementGroup[]; meta: Meta };
export type PricingResponse = { pricing: Pricing };
export type ServerResponse = { server: Server };
export type ActionResponse = { action: Action };
export type ActionsResponse = { actions: Action[]; meta: Meta };
