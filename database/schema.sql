-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.api_keys (
  edited_at timestamp without time zone NOT NULL DEFAULT now(),
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  environment text NOT NULL,
  callback_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  customer_id uuid NOT NULL,
  api_key text NOT NULL UNIQUE,
  banxico_api_key text NOT NULL UNIQUE,
  active boolean NOT NULL,
  last_used timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'America/Mexico_City'::text),
  CONSTRAINT api_keys_pkey PRIMARY KEY (id),
  CONSTRAINT api_keys_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id)
);
CREATE TABLE public.customers (
  email text,
  phone character varying,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  environment text NOT NULL,
  name text,
  bank_name text,
  bank_account character varying,
  CONSTRAINT customers_pkey PRIMARY KEY (id)
);
CREATE TABLE public.folios_codi (
  api_key text NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  folio_codi text NOT NULL,
  CONSTRAINT folios_codi_pkey PRIMARY KEY (id),
  CONSTRAINT folios_codi_api_key_fkey FOREIGN KEY (api_key) REFERENCES public.api_keys(api_key)
);
CREATE TABLE public.requests (
  environment text,
  request_object json,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
  route character varying NOT NULL,
  request_payload json NOT NULL,
  request_timestamp timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'America/Mexico_City'::text),
  api_key text,
  CONSTRAINT requests_pkey PRIMARY KEY (id)
);
CREATE TABLE public.responses (
  environment text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'America/Mexico_City'::text),
  request_id uuid NOT NULL DEFAULT gen_random_uuid(),
  response_payload json NOT NULL,
  response_timestamp timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'America/Mexico_City'::text),
  response_status smallint NOT NULL,
  CONSTRAINT responses_pkey PRIMARY KEY (id),
  CONSTRAINT api_responses_api_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.requests(id)
);