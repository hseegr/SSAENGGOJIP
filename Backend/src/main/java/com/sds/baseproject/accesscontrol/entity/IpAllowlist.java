package com.sds.baseproject.accesscontrol.entity;

import com.sds.baseproject.user.entity.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "cm_ip_allowlist")
@Getter
@Setter
public class IpAllowlist extends BaseEntity {
  @Id private String ipAddr;
  private String description;
}
